import {
  computeEsic,
  computeGrossToNet,
  computeMonthlyTds,
  computePf,
  computeProfessionalTax,
  round2,
} from "./payroll-calculator";

describe("round2", () => {
  it("rounds to 2 decimal places", () => {
    expect(round2(1234.5678)).toBe(1234.57);
    expect(round2(0.005)).toBeCloseTo(0.01, 2);
    expect(round2(100)).toBe(100);
  });
});

describe("computePf", () => {
  it("charges 12%/12% on wages below the ceiling", () => {
    expect(computePf(10_000)).toEqual({ employee: 1_200, employer: 1_200 });
  });

  it("caps the wage basis at the ₹15,000 statutory ceiling", () => {
    expect(computePf(50_000)).toEqual({ employee: 1_800, employer: 1_800 });
  });

  it("applies exactly at the ceiling boundary", () => {
    expect(computePf(15_000)).toEqual({ employee: 1_800, employer: 1_800 });
  });

  it("handles zero basic", () => {
    expect(computePf(0)).toEqual({ employee: 0, employer: 0 });
  });
});

describe("computeEsic", () => {
  it("applies 0.75%/3.25% when gross is within the ₹21,000 ceiling", () => {
    expect(computeEsic(20_000)).toEqual({ employee: 150, employer: 650 });
  });

  it("is zero exactly at the ceiling boundary is still eligible", () => {
    expect(computeEsic(21_000)).toEqual({ employee: 157.5, employer: 682.5 });
  });

  it("is zero just above the ceiling", () => {
    expect(computeEsic(21_000.01)).toEqual({ employee: 0, employer: 0 });
  });

  it("is zero for zero or negative gross", () => {
    expect(computeEsic(0)).toEqual({ employee: 0, employer: 0 });
    expect(computeEsic(-100)).toEqual({ employee: 0, employer: 0 });
  });
});

describe("computeProfessionalTax", () => {
  it("is zero at or below the ₹15,000 threshold", () => {
    expect(computeProfessionalTax(15_000)).toBe(0);
    expect(computeProfessionalTax(10_000)).toBe(0);
  });

  it("is a flat ₹200 above the threshold", () => {
    expect(computeProfessionalTax(15_001)).toBe(200);
    expect(computeProfessionalTax(200_000)).toBe(200);
  });
});

describe("computeMonthlyTds", () => {
  it("is zero when annualized taxable income is within the Section 87A rebate threshold", () => {
    // 50,000/month => annual gross 600,000 - 75,000 standard deduction = 525,000, under the 700,000 rebate threshold.
    expect(computeMonthlyTds(50_000)).toBe(0);
  });

  it("is zero for zero gross", () => {
    expect(computeMonthlyTds(0)).toBe(0);
  });

  it("charges slab tax with cess once past the rebate threshold", () => {
    // 100,000/month => annual gross 1,200,000 - 75,000 = 1,125,000 taxable.
    // Slabs: 0-300k@0 + 300k-700k@5%(20,000) + 700k-1,000k@10%(30,000) + 1,000k-1,125k@15%(18,750) = 68,750.
    // With 4% cess: 71,500. Monthly: 5,958.33.
    expect(computeMonthlyTds(100_000)).toBeCloseTo(5_958.33, 1);
  });

  it("increases monotonically with gross income", () => {
    const low = computeMonthlyTds(80_000);
    const high = computeMonthlyTds(150_000);
    expect(high).toBeGreaterThan(low);
  });
});

describe("computeGrossToNet", () => {
  it("computes a full-attendance month with no components or arrears", () => {
    const result = computeGrossToNet({ monthlyBasic: 30_000, payableDays: 30, totalWorkingDays: 30 });
    expect(result.basic).toBe(30_000);
    expect(result.hra).toBe(12_000);
    expect(result.specialAllowance).toBe(0);
    expect(result.grossEarnings).toBe(42_000);
    expect(result.pfEmployee).toBe(1_800); // capped at the 15,000 ceiling
    expect(result.arrearsIncluded).toBe(0);
    expect(result.netPay).toBeLessThan(result.grossEarnings);
  });

  it("prorates basic and HRA for loss-of-pay days", () => {
    const full = computeGrossToNet({ monthlyBasic: 30_000, payableDays: 30, totalWorkingDays: 30 });
    const halfAbsent = computeGrossToNet({ monthlyBasic: 30_000, payableDays: 15, totalWorkingDays: 30 });
    expect(halfAbsent.basic).toBeCloseTo(full.basic / 2, 2);
    expect(halfAbsent.hra).toBeCloseTo(full.hra / 2, 2);
  });

  it("treats zero total working days as zero pay ratio rather than dividing by zero", () => {
    const result = computeGrossToNet({ monthlyBasic: 30_000, payableDays: 0, totalWorkingDays: 0 });
    expect(result.basic).toBe(0);
    expect(result.grossEarnings).toBe(0);
    expect(Number.isFinite(result.netPay)).toBe(true);
  });

  it("adds component earnings/deductions and arrears without running arrears back through PF/ESIC/TDS", () => {
    const withoutExtras = computeGrossToNet({ monthlyBasic: 30_000, payableDays: 30, totalWorkingDays: 30 });
    const withExtras = computeGrossToNet({
      monthlyBasic: 30_000,
      payableDays: 30,
      totalWorkingDays: 30,
      componentEarnings: 5_000,
      componentDeductions: 1_000,
      arrearsIncluded: 2_000,
    });
    expect(withExtras.specialAllowance).toBe(5_000);
    expect(withExtras.otherDeductions).toBe(1_000);
    expect(withExtras.arrearsIncluded).toBe(2_000);
    expect(withExtras.grossEarnings).toBe(withoutExtras.grossEarnings + 5_000);
    // Statutory deductions (PF/ESIC/TDS) are computed off the higher gross, then arrears and
    // component-deductions are applied straight to net pay afterward.
    expect(withExtras.netPay).toBe(
      round(withExtras.grossEarnings - withExtras.pfEmployee - withExtras.esicEmployee - withExtras.professionalTax - withExtras.tds - 1_000 + 2_000),
    );
  });

  it("does not let ESIC apply once component earnings push gross past the ceiling", () => {
    const result = computeGrossToNet({
      monthlyBasic: 15_000,
      payableDays: 30,
      totalWorkingDays: 30,
      componentEarnings: 10_000,
    });
    expect(result.grossEarnings).toBeGreaterThan(21_000);
    expect(result.esicEmployee).toBe(0);
    expect(result.esicEmployer).toBe(0);
  });
});

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
