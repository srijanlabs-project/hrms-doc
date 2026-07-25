/**
 * Pure gross-to-net calculation engine for the v1 payroll slice — no DB
 * access, easy to unit-test in isolation. Every rule here is a deliberate
 * simplification of real Indian statutory payroll law; each function
 * documents exactly what it drops relative to the real rule.
 *
 * Spec: docs/08-submodule-specifications/09-payroll/03-earnings-and-deductions.md
 * and 05-payroll-processing.md. That spec models a configurable component
 * catalog (basic/HRA/allowances/deductions as data) with a formula engine;
 * v1 hardcodes the formulas below instead, because EmployeeCompensation only
 * stores `monthlyBasic` (see its schema comment) — there is no CTC structure
 * or component master to drive a real formula engine from.
 */

/** Exported so ArrearService can approximate a Basic-delta's gross impact the same way payroll itself would. */
export const HRA_RATE = 0.4;
const PF_RATE = 0.12;
const PF_WAGE_CEILING = 15_000;
const ESIC_RATE_EMPLOYEE = 0.0075;
const ESIC_RATE_EMPLOYER = 0.0325;
const ESIC_GROSS_CEILING = 21_000;
const PT_THRESHOLD = 15_000;
const PT_AMOUNT = 200;
const STANDARD_DEDUCTION = 75_000;
const SECTION_87A_REBATE_THRESHOLD = 700_000;
const CESS_RATE = 0.04;

/** New-regime (FY2024-25 default regime) slabs. Old-regime, HRA exemption, and 80C-style deductions are out of scope — the new regime disallows nearly all of them anyway. */
const TDS_SLABS = [
  { upTo: 300_000, rate: 0 },
  { upTo: 700_000, rate: 0.05 },
  { upTo: 1_000_000, rate: 0.1 },
  { upTo: 1_200_000, rate: 0.15 },
  { upTo: 1_500_000, rate: 0.2 },
  { upTo: Infinity, rate: 0.3 },
];

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** EPF: 12% employee + 12% employer, on wage capped at the statutory ₹15,000 ceiling. Real EPFO wage definition (which allowances count, LOP treatment) is more nuanced — this uses prorated Basic only. */
export function computePf(proratedBasic: number): { employee: number; employer: number } {
  const wageBasis = Math.min(proratedBasic, PF_WAGE_CEILING);
  return { employee: round2(wageBasis * PF_RATE), employer: round2(wageBasis * PF_RATE) };
}

/** ESIC applies only when gross wages are within the ₹21,000 eligibility ceiling; 0.75%/3.25% split. No half-yearly contribution-period carry-forward (real ESIC keeps an employee in-scheme for the rest of the period even if a later raise crosses the ceiling) — deferred. */
export function computeEsic(grossEarnings: number): { employee: number; employer: number } {
  if (grossEarnings <= 0 || grossEarnings > ESIC_GROSS_CEILING) {
    return { employee: 0, employer: 0 };
  }
  return { employee: round2(grossEarnings * ESIC_RATE_EMPLOYEE), employer: round2(grossEarnings * ESIC_RATE_EMPLOYER) };
}

/** Generic two-tier approximation, NOT state-specific. Real Professional Tax is a state master (slabs, caps, and a distinct February amount vary by state) — deferred until a state-wise PT table exists. */
export function computeProfessionalTax(grossEarnings: number): number {
  return grossEarnings > PT_THRESHOLD ? PT_AMOUNT : 0;
}

function slabTax(taxableIncome: number): number {
  let tax = 0;
  let lowerBound = 0;
  for (const slab of TDS_SLABS) {
    if (taxableIncome <= lowerBound) break;
    const amountInSlab = Math.min(taxableIncome, slab.upTo) - lowerBound;
    tax += amountInSlab * slab.rate;
    lowerBound = slab.upTo;
  }
  return tax;
}

/**
 * Monthly TDS estimated by annualizing this month's gross (monthlyGross * 12),
 * applying the standard deduction, new-regime slabs, Section 87A rebate
 * (ignoring marginal relief), and 4% cess — then dividing by 12. Real payroll
 * recomputes projected annual tax from cumulative YTD earnings each month and
 * true-ups the difference; this flat per-month estimate is simpler and does
 * not true-up for mid-year pay changes.
 */
export function computeMonthlyTds(monthlyGrossEarnings: number): number {
  const annualGross = monthlyGrossEarnings * 12;
  const taxableIncome = Math.max(0, annualGross - STANDARD_DEDUCTION);
  let annualTax = slabTax(taxableIncome);
  if (taxableIncome <= SECTION_87A_REBATE_THRESHOLD) {
    annualTax = 0;
  }
  const withCess = annualTax * (1 + CESS_RATE);
  return round2(withCess / 12);
}

export interface GrossToNetInput {
  monthlyBasic: number;
  payableDays: number;
  totalWorkingDays: number;
  /** Sum of the employee's active Earning-type EmployeePayComponent rows for this period (02-pay-components.md). Defaults to 0. */
  componentEarnings?: number;
  /** Sum of the employee's active Deduction-type EmployeePayComponent rows for this period. Defaults to 0. */
  componentDeductions?: number;
  /** One-time lump sum from Pending ArrearEntry rows being consumed this run (04-arrears-and-retro-pay.md). Added straight to net pay — not run back through PF/ESIC/TDS, a deliberate simplification. Defaults to 0. */
  arrearsIncluded?: number;
}

export interface GrossToNetResult {
  basic: number;
  hra: number;
  specialAllowance: number;
  grossEarnings: number;
  pfEmployee: number;
  pfEmployer: number;
  esicEmployee: number;
  esicEmployer: number;
  professionalTax: number;
  tds: number;
  otherDeductions: number;
  arrearsIncluded: number;
  netPay: number;
}

/**
 * specialAllowance now carries the employee's summed Earning-type pay
 * components (was always 0 pre-E09-deepening — see PayComponent). Basic and
 * HRA are both scaled by payableDays/totalWorkingDays for loss-of-pay; days
 * with no attendance mark are treated as present (attendance is
 * exception-marked, not mandatory-marked — see AttendanceService), so only
 * explicit Absent/HalfDay marks reduce pay. PercentOfBasic components are
 * expected to already be prorated by the caller (they're computed from
 * prorated Basic, not full monthlyBasic).
 */
export function computeGrossToNet(input: GrossToNetInput): GrossToNetResult {
  const ratio = input.totalWorkingDays > 0 ? input.payableDays / input.totalWorkingDays : 0;
  const basic = round2(input.monthlyBasic * ratio);
  const hra = round2(input.monthlyBasic * HRA_RATE * ratio);
  const specialAllowance = round2(input.componentEarnings ?? 0);
  const otherDeductions = round2(input.componentDeductions ?? 0);
  const arrearsIncluded = round2(input.arrearsIncluded ?? 0);
  const grossEarnings = round2(basic + hra + specialAllowance);

  const pf = computePf(basic);
  const esic = computeEsic(grossEarnings);
  const professionalTax = computeProfessionalTax(grossEarnings);
  const tds = computeMonthlyTds(grossEarnings);
  const netPay = round2(
    grossEarnings - pf.employee - esic.employee - professionalTax - tds - otherDeductions + arrearsIncluded,
  );

  return {
    basic,
    hra,
    specialAllowance,
    grossEarnings,
    pfEmployee: pf.employee,
    pfEmployer: pf.employer,
    esicEmployee: esic.employee,
    esicEmployer: esic.employer,
    professionalTax,
    tds,
    otherDeductions,
    arrearsIncluded,
    netPay,
  };
}
