/** Mirrors apps/api Prisma models. Hand-authored until OpenAPI codegen exists (see http.ts). */

/** File Storage engine (Foundation & Platform, E00) — a real uploaded file, referenced by id. */
export interface StoredFile {
  id: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
}

/** The subset of StoredFile returned when embedded on a parent record (e.g. EmployeeDocument.file). */
export type StoredFileRef = Pick<StoredFile, "id" | "originalName" | "mimeType">;

export interface Department {
  id: string;
  code: string;
  name: string;
  status: string;
  parentDepartmentId: string | null;
  createdAt: string;
}

export interface EmployeeDepartmentRef {
  id: string;
  name: string;
}

export interface Employee {
  id: string;
  employeeCode: string;
  legalName: string;
  preferredName: string | null;
  dateOfBirth: string | null;
  personalEmail: string | null;
  mobileNumber: string | null;
  departmentId: string | null;
  department: EmployeeDepartmentRef | null;
  managerId: string | null;
  status: string;
  joiningDate: string | null;
  lastWorkingDay: string | null;
  exitReason: string | null;
  createdAt: string;
}

export interface CreateEmployeeInput {
  employeeCode: string;
  legalName: string;
  preferredName?: string;
  dateOfBirth?: string;
  personalEmail?: string;
  mobileNumber?: string;
  departmentId?: string;
  managerId?: string;
  joiningDate?: string;
}

export interface LeavePolicy {
  id: string;
  leaveType: string;
  name: string;
  annualDays: number;
  status: string;
  carryForwardCapDays: number;
  sandwichRuleEnabled: boolean;
}

export interface LeaveBalance {
  leaveType: string;
  name: string;
  entitlement: number;
  prorated: number;
  consumed: number;
  /** Net of this year's ledger entries (manual adjustments + carry-forward-in) already folded into `available`. */
  ledgerNet: number;
  available: number;
}

/** Wave 2 W2·E08 deepening (02-leave-accrual.md) — additive correction ledger, not a full accrual-posting rebuild. */
export interface LeaveLedgerEntry {
  id: string;
  employeeId: string;
  leaveType: string;
  periodYear: number;
  entryType: "Adjustment" | "CarryForward";
  amountDays: number;
  reason: string | null;
  postedByUserId: string;
  createdAt: string;
}

export interface CreateLeaveAdjustmentInput {
  employeeId: string;
  leaveType: string;
  amountDays: number;
  periodYear?: number;
  reason: string;
}

export interface CarryForwardRunResult {
  fromYear: number;
  toYear: number;
  posted: number;
  skippedExisting: number;
}

export interface LeaveRequestEmployeeRef {
  id: string;
  legalName: string;
  employeeCode: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employee: LeaveRequestEmployeeRef;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string | null;
  status: string;
  approverId: string | null;
  decisionNote: string | null;
  decidedAt: string | null;
  createdAt: string;
}

export interface ExpenseClaim {
  id: string;
  employeeId: string;
  employee: LeaveRequestEmployeeRef;
  category: string;
  amount: number;
  expenseDate: string;
  merchant: string | null;
  businessPurpose: string | null;
  status: string;
  approverId: string | null;
  decisionNote: string | null;
  decidedAt: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface CreateExpenseClaimInput {
  category: string;
  amount: number;
  expenseDate: string;
  merchant?: string;
  businessPurpose?: string;
}

export interface TravelRequest {
  id: string;
  employeeId: string;
  employee: LeaveRequestEmployeeRef;
  tripType: string;
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  estimatedCost: number | null;
  purpose: string | null;
  status: string;
  approverId: string | null;
  decisionNote: string | null;
  decidedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

export interface CreateTravelRequestInput {
  tripType: string;
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  estimatedCost?: number;
  purpose?: string;
}

export interface Asset {
  id: string;
  assetTag: string;
  category: string;
  name: string;
  status: string;
  createdAt: string;
}

export interface CreateAssetInput {
  /** Auto-allocated from the Number Series engine's "Asset" series when omitted. */
  assetTag?: string;
  category: string;
  name: string;
}

export interface AssetAssignmentRef {
  id: string;
  assetTag: string;
  category: string;
  name: string;
}

export interface AssetAssignment {
  id: string;
  employeeId: string;
  employee: LeaveRequestEmployeeRef;
  assetId: string;
  asset: AssetAssignmentRef;
  status: string;
  assignedAt: string;
  returnedAt: string | null;
  returnCondition: string | null;
  notes: string | null;
}

export interface CreateLeaveRequestInput {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  linkPath: string | null;
  readAt: string | null;
  createdAt: string;
}

export interface AttendanceDay {
  id: string;
  employeeId: string;
  date: string;
  status: string;
  source: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  flexCompliant: boolean | null;
}

export interface MarkAttendanceInput {
  date: string;
  status: string;
  checkInTime?: string;
  checkOutTime?: string;
}

export interface TeamAttendanceEntry {
  employeeId: string;
  employeeCode: string;
  legalName: string;
  department: string | null;
  date: string;
  status: string;
}

export interface Compensation {
  id: string;
  employeeId: string;
  employee: LeaveRequestEmployeeRef;
  monthlyBasic: number;
  effectiveFrom: string;
}

export interface SetCompensationInput {
  employeeId: string;
  monthlyBasic: number;
  effectiveFrom: string;
}

export interface PayrollRun {
  id: string;
  periodYear: number;
  periodMonth: number;
  status: string;
  processedAt: string | null;
  approvedAt: string | null;
  closedAt: string | null;
}

export interface PayrollRunResult {
  id: string;
  employeeId: string;
  employee: LeaveRequestEmployeeRef;
  payableDays: number;
  totalWorkingDays: number;
  basic: number | null;
  hra: number | null;
  specialAllowance: number | null;
  grossEarnings: number | null;
  pfEmployee: number | null;
  pfEmployer: number | null;
  esicEmployee: number | null;
  esicEmployer: number | null;
  professionalTax: number | null;
  tds: number | null;
  otherDeductions: number | null;
  arrearsIncluded: number | null;
  netPay: number | null;
  hasException: boolean;
  exceptionNote: string | null;
}

/** Wave 2 W2·E09 deepening (02-pay-components.md). */
export interface PayComponent {
  id: string;
  code: string;
  name: string;
  type: "Earning" | "Deduction";
  calculationMethod: "FixedAmount" | "PercentOfBasic";
  defaultValue: number;
  isActive: boolean;
}

export interface CreatePayComponentInput {
  code: string;
  name: string;
  type: "Earning" | "Deduction";
  calculationMethod: "FixedAmount" | "PercentOfBasic";
  defaultValue: number;
}

export interface EmployeePayComponent {
  id: string;
  employeeId: string;
  payComponentId: string;
  payComponent: PayComponent;
  value: number | null;
  isActive: boolean;
}

/** 04-arrears-and-retro-pay.md — one lump-sum entry per trigger, no period-by-period breakdown. */
export interface ArrearEntry {
  id: string;
  employeeId: string;
  sourceType: string;
  description: string;
  amount: number;
  status: "Pending" | "Included" | "Paid";
  createdAt: string;
}

/** 07-full-and-final-settlement.md v1 slice. */
export interface FnfCase {
  id: string;
  employeeId: string;
  employee: LeaveRequestEmployeeRef;
  exitDate: string;
  finalMonthNetPay: number;
  leaveEncashment: number;
  arrearsIncluded: number;
  gratuityAmount: number;
  netPayable: number;
  status: "Draft" | "Approved" | "Released";
  calculatedAt: string;
  approvedAt: string | null;
  releasedAt: string | null;
}

export interface PayrollRunWithResults extends PayrollRun {
  results: PayrollRunResult[];
}

export interface Payslip extends PayrollRunResult {
  payrollRun: PayrollRun;
}

export interface ExitSummary {
  employeeCode: string;
  legalName: string;
  department: string | null;
  status: string;
  lastWorkingDay: string | null;
  exitReason: string | null;
  payslips: Payslip[];
}

export interface Requisition {
  id: string;
  code: string;
  title: string;
  departmentId: string | null;
  department: { id: string; name: string } | null;
  hiringManagerId: string | null;
  hiringManager: { id: string; legalName: string } | null;
  headcount: number;
  compensationMin: number | null;
  compensationMax: number | null;
  targetJoinDate: string | null;
  isInternal: boolean;
  status: string;
  createdAt: string;
}

export interface CreateRequisitionInput {
  code: string;
  title: string;
  departmentId?: string;
  hiringManagerId?: string;
  headcount: number;
  compensationMin?: number;
  compensationMax?: number;
  targetJoinDate?: string;
  isInternal?: boolean;
}

export interface Candidate {
  id: string;
  fullName: string;
  email: string;
  source: string;
  tags: string[];
  notes: string | null;
  createdAt: string;
}

export interface CreateCandidateInput {
  fullName: string;
  email: string;
  source?: string;
  tags?: string[];
  notes?: string;
}

export interface CandidateAssessment {
  id: string;
  candidateId: string;
  applicationId: string | null;
  type: string;
  score: number | null;
  maxScore: number | null;
  notes: string | null;
  administeredAt: string;
}

export interface CreateAssessmentInput {
  applicationId?: string;
  type: string;
  score?: number;
  maxScore?: number;
  notes?: string;
}

export interface ApplicationOfferRef {
  id: string;
  status: string;
  monthlyBasic: number;
  joiningDate: string;
  backgroundCheck: BackgroundCheck | null;
}

export interface Application {
  id: string;
  requisitionId: string;
  candidateId: string;
  candidate: { id: string; fullName: string; email: string; source: string };
  offer: ApplicationOfferRef | null;
  stage: string;
  rejectionReason: string | null;
  createdAt: string;
}

export interface BackgroundCheck {
  id: string;
  checkType: string;
  status: string;
  remarks: string | null;
}

export interface Offer {
  id: string;
  applicationId: string;
  monthlyBasic: number;
  joiningDate: string;
  status: string;
  declineReason: string | null;
  convertedEmployeeId: string | null;
  backgroundCheck: BackgroundCheck | null;
  application: {
    id: string;
    requisitionId: string;
    candidate: { id: string; fullName: string; email: string };
    requisition: { id: string; title: string };
  };
}

export interface OpenRequisition {
  id: string;
  title: string;
  headcount: number;
}

export interface ReferredApplication {
  id: string;
  stage: string;
  requisition: { id: string; title: string };
}

export interface ReferredCandidate {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  applications: ReferredApplication[];
}

export interface SubmitReferralInput {
  requisitionId: string;
  fullName: string;
  email: string;
}

/** Internal Mobility — reuses the Requisition/Candidate/Application pipeline; see requisition.isInternal. */
export interface InternalOpening {
  id: string;
  title: string;
  headcount: number;
  compensationMin: number | null;
  compensationMax: number | null;
  department: { id: string; name: string } | null;
}

export interface InternalMobilityCandidate {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  applications: ReferredApplication[];
}

export interface SubmitInternalApplicationInput {
  requisitionId: string;
}

export interface InterviewFeedback {
  id: string;
  rating: number;
  recommendation: string;
  comments: string | null;
}

export interface InterviewRound {
  id: string;
  applicationId: string;
  roundNumber: number;
  interviewerId: string;
  interviewer: { id: string; legalName: string };
  scheduledAt: string;
  mode: string;
  status: string;
  feedback: InterviewFeedback | null;
}

export interface ScheduleInterviewInput {
  applicationId: string;
  interviewerId: string;
  scheduledAt: string;
  mode?: string;
}

export interface SubmitInterviewFeedbackInput {
  rating: number;
  recommendation: string;
  comments?: string;
}

export interface OnboardingTask {
  id: string;
  caseId: string;
  title: string;
  isBlocking: boolean;
  status: string;
  completedAt: string | null;
}

export interface OnboardingCase {
  id: string;
  employeeId: string;
  employee: { id: string; legalName: string; employeeCode: string };
  status: string;
  activatedAt: string | null;
  tasks: OnboardingTask[];
  createdAt: string;
}

export interface ReportsSummary {
  headcount: {
    total: number;
    active: number;
    byStatus: Record<string, number>;
  };
  attendanceToday: {
    Present: number;
    Absent: number;
    HalfDay: number;
    notMarked: number;
  };
  leave: {
    pendingRequests: number;
  };
  recruitment: {
    openRequisitions: number;
    openHeadcountDemand: number;
    applicationsByStage: Record<string, number>;
  };
  onboarding: {
    inProgress: number;
    activated: number;
  };
  payrollCost: {
    periodYear: number;
    periodMonth: number;
    totalNetPay: number;
  } | null;
}

export interface BulkImportRowResult {
  index: number;
  success: boolean;
  employeeCode?: string;
  error?: string;
}

/** Wave 3 W3·E11 Performance Management deepening — a Goal doubles as an OKR "Objective" once it has KeyResults. */
export interface KeyResult {
  id: string;
  goalId: string;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string | null;
  createdAt: string;
}

export interface Goal {
  id: string;
  employeeId: string;
  periodYear: number;
  title: string;
  description: string | null;
  weight: number;
  progress: number;
  progressNote: string | null;
  dueDate: string | null;
  status: string;
  createdAt: string;
  keyResults: KeyResult[];
}

export interface CreateGoalInput {
  periodYear: number;
  title: string;
  description?: string;
  weight?: number;
  dueDate?: string;
}

export interface CreateKeyResultInput {
  goalId: string;
  title: string;
  targetValue: number;
  unit?: string;
}

export interface Competency {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreateCompetencyInput {
  name: string;
  description?: string;
}

export interface CompetencyAssessment {
  id: string;
  employeeId: string;
  competencyId: string;
  competency: { id: string; name: string };
  periodYear: number;
  rating: number;
  comments: string | null;
  assessedByUserId: string;
  createdAt: string;
}

export interface AssessCompetencyInput {
  employeeId: string;
  competencyId: string;
  periodYear: number;
  rating: number;
  comments?: string;
}

export interface CheckIn {
  id: string;
  employeeId: string;
  employee: { id: string; legalName: string; employeeCode: string };
  managerId: string;
  manager: { id: string; legalName: string; employeeCode: string };
  scheduledDate: string;
  agenda: string | null;
  managerNotes: string | null;
  employeeNotes: string | null;
  status: "Scheduled" | "Completed" | "Cancelled";
  completedAt: string | null;
  createdAt: string;
}

export interface CreateCheckInInput {
  employeeId: string;
  scheduledDate: string;
  agenda?: string;
}

export interface LearningCourse {
  id: string;
  title: string;
  description: string | null;
  durationHours: number;
  isMandatory: boolean;
  recurrenceMonths: number | null;
  passingScore: number | null;
  skillTags: string[];
  status: string;
  createdAt: string;
}

export interface CreateCourseInput {
  title: string;
  description?: string;
  durationHours: number;
  isMandatory?: boolean;
  recurrenceMonths?: number;
  passingScore?: number;
  skillTags?: string[];
}

export interface LearningEnrollment {
  id: string;
  employeeId: string;
  courseId: string;
  course: { id: string; title: string; durationHours: number; isMandatory: boolean; passingScore: number | null; skillTags: string[] };
  status: string;
  dueDate: string | null;
  assignedAutomatically: boolean;
  assessmentScore: number | null;
  assessmentMaxScore: number | null;
  assessmentPassed: boolean | null;
  completedAt: string | null;
  createdAt: string;
}

export interface TeamEnrollment extends LearningEnrollment {
  employee: { id: string; legalName: string; employeeCode: string };
}

/** W3·E12 gap closure — learning paths + skill development. */
export interface LearningPath {
  id: string;
  title: string;
  description: string | null;
  status: string;
  courses: Array<{ id: string; sequenceOrder: number; course: { id: string; title: string; durationHours: number } }>;
}

export interface CreateLearningPathInput {
  title: string;
  description?: string;
  courseIds: string[];
}

export interface LearningPathProgress {
  path: LearningPath;
  completedCourses: number;
  totalCourses: number;
  isComplete: boolean;
}

export interface SkillDevelopmentSummary {
  developedSkillTags: string[];
  recommendedCourses: Array<{ id: string; title: string; skillTags: string[] }>;
}

export interface CertificationCatalog {
  id: string;
  code: string;
  name: string;
  issuer: string | null;
  validityMonths: number | null;
  isMandatory: boolean;
  isActive: boolean;
}

export interface CreateCertificationCatalogInput {
  code: string;
  name: string;
  issuer?: string;
  validityMonths?: number;
  isMandatory?: boolean;
}

export interface CertificationRecord {
  id: string;
  employeeId: string;
  employee: { id: string; legalName: string; employeeCode: string; managerId: string | null };
  certificationCatalogId: string;
  certification: { id: string; code: string; name: string; issuer: string | null; isMandatory: boolean };
  certificateNumber: string | null;
  issueDate: string;
  expiryDate: string | null;
  status: string;
  evidenceFileId: string | null;
  verifiedByUserId: string | null;
  verifiedAt: string | null;
  revokedReason: string | null;
  createdAt: string;
}

export interface CreateCertificationRecordInput {
  certificationCatalogId: string;
  employeeId?: string;
  certificateNumber?: string;
  issueDate: string;
  evidenceFileId?: string;
}

export interface CompensationReviewCycle {
  id: string;
  periodYear: number;
  status: string;
  createdAt: string;
}

export interface CompensationReviewItem {
  id: string;
  cycleId: string;
  employeeId: string;
  employee: { id: string; legalName: string; employeeCode: string };
  currentMonthlyBasic: number;
  proposedMonthlyBasic: number;
  status: string;
  appliedAt: string | null;
  createdAt: string;
}

/** Wave 3 E14 gap closure — bonus planning + incentives. */
export interface PayoutPlanCycle {
  id: string;
  periodYear: number;
  label: string;
  payType: "Bonus" | "Incentive";
  status: string;
  createdAt: string;
}

export interface CreatePayoutCycleInput {
  periodYear: number;
  label: string;
  payType: "Bonus" | "Incentive";
}

export interface PayoutPlanItem {
  id: string;
  cycleId: string;
  employeeId: string;
  employee: { id: string; legalName: string; employeeCode: string };
  proposedAmount: number;
  reason: string;
  status: "Proposed" | "Approved" | "Rejected" | "Posted";
  decisionNote: string | null;
  postedAt: string | null;
  createdAt: string;
}

export interface ProposePayoutItemInput {
  employeeId: string;
  proposedAmount: number;
  reason: string;
}

/** Wave 3 E14 gap closure — ESOPs. */
export interface EsopGrant {
  id: string;
  employeeId: string;
  employee: { id: string; legalName: string; employeeCode: string };
  totalUnits: number;
  vestedUnits: number;
  grantDate: string;
  vestingStartDate: string;
  vestingYears: number;
  cliffMonths: number;
  exercisePrice: number | null;
  status: "Active" | "Cancelled";
  createdAt: string;
}

export interface CreateEsopGrantInput {
  employeeId: string;
  totalUnits: number;
  grantDate: string;
  vestingStartDate: string;
  vestingYears: number;
  cliffMonths?: number;
  exercisePrice?: number;
}

export interface BenefitPlan {
  id: string;
  code: string;
  name: string;
  category: string;
  employerCost: number;
  employeeCost: number;
  maxAnnualAllocation: number | null;
  isActive: boolean;
}

export interface CreateBenefitPlanInput {
  code: string;
  name: string;
  category: string;
  employerCost?: number;
  employeeCost?: number;
  maxAnnualAllocation?: number;
}

export interface BenefitEnrollment {
  id: string;
  employeeId: string;
  benefitPlanId: string;
  benefitPlan: BenefitPlan;
  status: string;
  effectiveDate: string;
  allocatedAmount: number | null;
  waiverReason: string | null;
  terminatedAt: string | null;
}

export interface AdminBenefitEnrollment extends BenefitEnrollment {
  employee: { id: string; legalName: string; employeeCode: string };
}

export interface EnrollBenefitInput {
  benefitPlanId: string;
  effectiveDate: string;
  allocatedAmount?: number;
}

export interface FlexBasketStatus {
  annualAmount: number | null;
  allocated: number;
  remaining: number | null;
}

export interface TalentAssessment {
  id: string;
  employeeId: string;
  employee: { id: string; legalName: string; employeeCode: string };
  periodYear: number;
  performanceRating: number;
  potentialRating: string;
  notes: string | null;
  createdAt: string;
}

export interface UpsertTalentAssessmentInput {
  employeeId: string;
  periodYear: number;
  performanceRating: number;
  potentialRating: string;
  notes?: string;
}

export interface Successor {
  id: string;
  criticalRoleId: string;
  employeeId: string;
  employee: { id: string; legalName: string; employeeCode: string };
  readiness: string;
  isEmergency: boolean;
  notes: string | null;
}

export interface CriticalRole {
  id: string;
  title: string;
  departmentId: string | null;
  department: { id: string; name: string } | null;
  incumbentEmployeeId: string | null;
  incumbent: { id: string; legalName: string } | null;
  criticalityTier: string;
  isActive: boolean;
  successors: Successor[];
  hasReadyCoverage: boolean;
}

export interface CreateCriticalRoleInput {
  title: string;
  departmentId?: string;
  incumbentEmployeeId?: string;
  criticalityTier?: string;
}

export interface AddSuccessorInput {
  employeeId: string;
  readiness?: string;
  isEmergency?: boolean;
  notes?: string;
}

/** Wave 3 E13 gap closure ("workforce planning linkage"). */
export interface DepartmentRisk {
  departmentId: string | null;
  departmentName: string;
  headcount: number;
  attritionRate: number;
}

export interface CriticalRoleWithRisk extends CriticalRole {
  departmentRisk: DepartmentRisk | null;
}

/** Wave 3 E13 gap closure ("career planning"). */
export interface CareerPlanAction {
  id: string;
  title: string;
  status: "NotStarted" | "Completed";
  completedAt: string | null;
}

export interface CareerPlan {
  id: string;
  employeeId: string;
  employee: { id: string; legalName: string; employeeCode: string; managerId: string | null };
  targetDesignationId: string | null;
  targetDesignation: { id: string; title: string } | null;
  timeframeYears: number | null;
  developmentNotes: string;
  status: "Draft" | "Active" | "Achieved" | "Cancelled";
  actions: CareerPlanAction[];
  createdAt: string;
}

export interface CreateCareerPlanInput {
  targetDesignationId?: string;
  timeframeYears?: number;
  developmentNotes: string;
  actions?: string[];
}

export interface Company {
  id: string;
  code: string;
  name: string;
  status: string;
  parentCompanyId: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
  tagline: string | null;
  fiscalYearStartMonth: number;
  createdAt: string;
}

export interface CreateCompanyInput {
  code: string;
  name: string;
  parentCompanyId?: string;
  logoUrl?: string;
  primaryColor?: string;
  tagline?: string;
  fiscalYearStartMonth?: number;
}

export interface OrgUnit {
  id: string;
  unitType: string;
  code: string;
  name: string;
  status: string;
  parentUnitId: string | null;
  addressLine: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  createdAt: string;
}

export interface CreateOrgUnitInput {
  unitType: string;
  code: string;
  name: string;
  parentUnitId?: string;
  addressLine?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface FinancialCenter {
  id: string;
  centerType: string;
  code: string;
  name: string;
  status: string;
  parentCenterId: string | null;
  createdAt: string;
}

export interface CreateFinancialCenterInput {
  centerType: string;
  code: string;
  name: string;
  parentCenterId?: string;
}

export interface ReportingLine {
  id: string;
  employeeId: string;
  employee: LeaveRequestEmployeeRef;
  managerId: string;
  manager: LeaveRequestEmployeeRef;
  lineType: string;
  startDate: string;
  endDate: string | null;
  notes: string | null;
  status: string;
  createdAt: string;
}

export interface CreateReportingLineInput {
  employeeId: string;
  managerId: string;
  lineType: string;
  startDate: string;
  endDate?: string;
  notes?: string;
}

export interface JobFamily {
  id: string;
  code: string;
  name: string;
  status: string;
  createdAt: string;
}

export interface CreateJobFamilyInput {
  code: string;
  name: string;
}

export interface JobFunction {
  id: string;
  code: string;
  name: string;
  status: string;
  jobFamilyId: string | null;
  createdAt: string;
}

export interface CreateJobFunctionInput {
  code: string;
  name: string;
  jobFamilyId?: string;
}

export interface Designation {
  id: string;
  code: string;
  title: string;
  status: string;
  jobFunctionId: string | null;
  careerTrack: string;
  createdAt: string;
}

export interface CreateDesignationInput {
  code: string;
  title: string;
  jobFunctionId?: string;
  careerTrack?: string;
}

export interface Grade {
  id: string;
  code: string;
  name: string;
  band: string | null;
  status: string;
  minCompensation: number | null;
  maxCompensation: number | null;
  createdAt: string;
}

export interface CreateGradeInput {
  code: string;
  name: string;
  band?: string;
  minCompensation?: number;
  maxCompensation?: number;
}

export interface Position {
  id: string;
  code: string;
  title: string;
  status: string;
  departmentId: string;
  department: { id: string; name: string };
  designationId: string | null;
  designation: { id: string; title: string } | null;
  employees: LeaveRequestEmployeeRef[];
  createdAt: string;
}

export interface CreatePositionInput {
  code: string;
  title: string;
  departmentId: string;
  designationId?: string;
}

export interface WorkCalendarDay {
  id: string;
  calendarId: string;
  date: string;
  dayType: string;
  label: string | null;
}

export interface WorkCalendar {
  id: string;
  code: string;
  name: string;
  status: string;
  days: WorkCalendarDay[];
  createdAt: string;
}

export interface CreateWorkCalendarInput {
  code: string;
  name: string;
}

export interface AddCalendarDayInput {
  date: string;
  dayType: string;
  label?: string;
}

export interface WorkCalendarAssignment {
  id: string;
  calendarId: string;
  scope: string;
  scopeId: string | null;
}

export interface OrgPolicy {
  id: string;
  category: string;
  title: string;
  content: string;
  status: string;
  effectiveFrom: string;
  createdAt: string;
}

export interface CreateOrgPolicyInput {
  category: string;
  title: string;
  content: string;
  effectiveFrom: string;
}

export interface OrgTreeNode {
  id: string;
  code: string;
  name: string;
  type: string;
  children: OrgTreeNode[];
}

export interface OrgTree {
  companies: OrgTreeNode[];
  orgUnits: OrgTreeNode[];
  departments: OrgTreeNode[];
}

export interface PersonalDetail {
  id: string;
  employeeId: string;
  maritalStatus: string | null;
  gender: string | null;
  bloodGroup: string | null;
  nationality: string | null;
  currentAddressLine: string | null;
  currentCity: string | null;
  currentState: string | null;
  currentCountry: string | null;
  currentPincode: string | null;
  permanentSameAsCurrent: boolean;
  permanentAddressLine: string | null;
  permanentCity: string | null;
  permanentState: string | null;
  permanentCountry: string | null;
  permanentPincode: string | null;
}

export interface UpsertPersonalDetailInput {
  maritalStatus?: string;
  gender?: string;
  bloodGroup?: string;
  nationality?: string;
  currentAddressLine?: string;
  currentCity?: string;
  currentState?: string;
  currentCountry?: string;
  currentPincode?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string | null;
  isPrimary: boolean;
}

export interface CreateEmergencyContactInput {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary?: boolean;
}

export interface PersonalDetailBundle {
  personalDetail: PersonalDetail | null;
  emergencyContacts: EmergencyContact[];
}

export interface IdentityDocument {
  id: string;
  documentType: string;
  documentNumber: string;
  issuingCountry: string | null;
  expiryDate: string | null;
  status: string;
  file: StoredFileRef | null;
}

export interface CreateIdentityDocumentInput {
  documentType: string;
  documentNumber: string;
  issuingCountry?: string;
  expiryDate?: string;
  fileId?: string;
}

export interface BankAccount {
  id: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string | null;
  bankName: string;
  branchName: string | null;
  isPrimary: boolean;
  status: string;
}

export interface CreateBankAccountInput {
  accountHolderName: string;
  accountNumber: string;
  ifscCode?: string;
  bankName: string;
  branchName?: string;
  isPrimary?: boolean;
}

export interface TaxProfile {
  id: string;
  panNumber: string | null;
  taxRegime: string | null;
  taxResidencyCountry: string | null;
}

export interface UpsertTaxProfileInput {
  panNumber?: string;
  taxRegime?: string;
  taxResidencyCountry?: string;
}

export interface IdentityFinanceBundle {
  identityDocuments: IdentityDocument[];
  bankAccounts: BankAccount[];
  taxProfile: TaxProfile | null;
}

export interface EmployeeCertification {
  id: string;
  name: string;
  issuingOrganization: string | null;
  issueDate: string | null;
  expiryDate: string | null;
  credentialId: string | null;
}

export interface CreateCertificationInput {
  name: string;
  issuingOrganization?: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
}

export interface EmployeeSkill {
  id: string;
  skillType: string;
  name: string;
  proficiencyLevel: string;
}

export interface CreateSkillInput {
  skillType: string;
  name: string;
  proficiencyLevel?: string;
}

export interface EducationRecord {
  id: string;
  degree: string;
  institution: string;
  fieldOfStudy: string | null;
  startYear: number | null;
  endYear: number | null;
  grade: string | null;
}

export interface CreateEducationInput {
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  startYear?: number;
  endYear?: number;
  grade?: string;
}

export interface PriorExperience {
  id: string;
  companyName: string;
  title: string;
  startDate: string | null;
  endDate: string | null;
  reasonForLeaving: string | null;
}

export interface CreatePriorExperienceInput {
  companyName: string;
  title: string;
  startDate?: string;
  endDate?: string;
  reasonForLeaving?: string;
}

export interface BackgroundBundle {
  certifications: EmployeeCertification[];
  skills: EmployeeSkill[];
  education: EducationRecord[];
  priorExperience: PriorExperience[];
}

export interface EmployeeAssignmentHistory {
  id: string;
  changeType: string;
  effectiveDate: string;
  fromDepartmentId: string | null;
  toDepartmentId: string | null;
  fromManagerId: string | null;
  toManagerId: string | null;
  fromDesignationId: string | null;
  toDesignationId: string | null;
  fromGradeId: string | null;
  toGradeId: string | null;
  reason: string | null;
  createdAt: string;
}

export interface CreateMovementInput {
  changeType: string;
  effectiveDate: string;
  toDepartmentId?: string;
  toManagerId?: string;
  toDesignationId?: string;
  toGradeId?: string;
  reason?: string;
}

export interface ProbationRecord {
  id: string;
  startDate: string;
  endDate: string;
  extendedUntil: string | null;
  status: string;
  decisionDate: string | null;
  decisionNote: string | null;
}

export interface CreateProbationInput {
  startDate: string;
  endDate: string;
}

export interface DecideProbationInput {
  decision: string;
  extendedUntil?: string;
  decisionNote?: string;
}

export interface ContractRenewal {
  id: string;
  previousEndDate: string | null;
  newEndDate: string;
  note: string | null;
  createdAt: string;
}

export interface CreateContractRenewalInput {
  newEndDate: string;
  note?: string;
}

export interface EmployeeDocument {
  id: string;
  documentType: string;
  title: string;
  referenceUrl: string | null;
  status: string;
  file: StoredFileRef | null;
}

export interface CreateEmployeeDocumentInput {
  documentType: string;
  title: string;
  referenceUrl?: string;
  fileId?: string;
}

export interface CareerBundle {
  assignmentHistory: EmployeeAssignmentHistory[];
  probationRecords: ProbationRecord[];
  contractRenewals: ContractRenewal[];
  documents: EmployeeDocument[];
}

export interface SalaryRevision {
  id: string;
  employeeId: string;
  employee: LeaveRequestEmployeeRef;
  previousMonthlyBasic: number;
  proposedMonthlyBasic: number;
  effectiveDate: string;
  reason: string | null;
  status: string;
  decisionNote: string | null;
  appliedAt: string | null;
}

export interface CreateSalaryRevisionInput {
  proposedMonthlyBasic: number;
  effectiveDate: string;
  reason?: string;
}

export interface TimelineEvent {
  date: string;
  type: string;
  title: string;
  detail?: string;
}

export interface Appraisal {
  id: string;
  employeeId: string;
  employee: { id: string; legalName: string; employeeCode: string; managerId: string | null };
  periodYear: number;
  status: string;
  selfRating: number | null;
  selfComments: string | null;
  selfSubmittedAt: string | null;
  managerRating: number | null;
  managerComments: string | null;
  managerSubmittedAt: string | null;
  finalizedAt: string | null;
  calibratedRating: number | null;
  calibrationSessionId: string | null;
  createdAt: string;
}

export interface FeedbackRater {
  id: string;
  campaignId: string;
  raterEmployeeId: string;
  raterEmployee: { id: string; legalName: string };
  category: string;
  status: string;
  rating: number | null;
  strengths: string | null;
  developmentAreas: string | null;
  submittedAt: string | null;
}

export interface FeedbackCampaign {
  id: string;
  subjectEmployeeId: string;
  subjectEmployee: { id: string; legalName: string; managerId: string | null };
  cycleYear: number;
  status: string;
  closedAt: string | null;
  raters: FeedbackRater[];
}

export interface FeedbackPendingRequest {
  id: string;
  category: string;
  campaign: { id: string; cycleYear: number; subjectEmployee: { id: string; legalName: string } };
}

export interface FeedbackSummary {
  id: string;
  cycleYear: number;
  closedAt: string | null;
  responseCount: number;
  averageRating: number | null;
  strengths: string[];
  developmentAreas: string[];
}

export interface CreateFeedbackCampaignInput {
  subjectEmployeeId: string;
  cycleYear: number;
}

export interface NominateRaterInput {
  raterEmployeeId: string;
  category: string;
}

export interface SubmitFeedback360Input {
  rating: number;
  strengths?: string;
  developmentAreas?: string;
}

export interface CalibrationCase {
  id: string;
  sessionId: string;
  appraisalId: string;
  employeeId: string;
  employee: { id: string; legalName: string; employeeCode: string };
  originalRating: number;
  calibratedRating: number | null;
  rationale: string | null;
  decidedAt: string | null;
}

export interface CalibrationSession {
  id: string;
  periodYear: number;
  cohortLabel: string;
  status: string;
  closedAt: string | null;
  cases: CalibrationCase[];
}

export interface CreateCalibrationSessionInput {
  periodYear: number;
  cohortLabel: string;
}

/** W3·E11 gap closure — Performance Improvement Plan. */
export interface PipObjective {
  id: string;
  title: string;
  targetDate: string | null;
  status: "NotStarted" | "Completed";
  completedAt: string | null;
}

export interface PerformanceImprovementPlan {
  id: string;
  employeeId: string;
  employee: { id: string; legalName: string; employeeCode: string; managerId: string | null };
  reason: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Completed" | "Extended" | "Failed";
  outcomeNotes: string | null;
  closedAt: string | null;
  objectives: PipObjective[];
  createdAt: string;
}

export interface CreatePipInput {
  employeeId: string;
  reason: string;
  startDate: string;
  endDate: string;
  objectives: string[];
}

/** Workforce Management (E07) — 03-shift-management.md. No version history: edits apply immediately. */
export interface ShiftDefinition {
  id: string;
  code: string;
  name: string;
  startTime: string;
  endTime: string;
  crossMidnight: boolean;
  plannedMinutes: number;
  graceMinutes: number;
  isActive: boolean;
}

export interface CreateShiftInput {
  code: string;
  name: string;
  startTime: string;
  endTime: string;
  crossMidnight?: boolean;
  plannedMinutes: number;
  graceMinutes?: number;
}

export interface ShiftAssignment {
  id: string;
  employeeId: string;
  shiftId: string;
  shift: ShiftDefinition;
  effectiveFrom: string;
  effectiveTo: string | null;
}

export interface ShiftAssignmentWithEmployee extends ShiftAssignment {
  employee: LeaveRequestEmployeeRef;
}

/** 04-rostering.md + 07-workforce-scheduling.md, consolidated into one entry model. */
export interface RosterEntry {
  id: string;
  employeeId: string;
  employee: LeaveRequestEmployeeRef;
  shiftId: string;
  shift: ShiftDefinition;
  date: string;
  status: string;
}

export interface MyRosterDay {
  entryId: string | null;
  date: string;
  shiftId: string | null;
  shiftName: string | null;
  status: string;
  source: "Roster" | "Default" | "Unassigned";
}

export interface RosterSwapRequest {
  id: string;
  rosterEntryId: string;
  requestedByEmployeeId: string;
  counterpartEmployeeId: string;
  reason: string | null;
  status: string;
  decisionNote: string | null;
  decidedAt: string | null;
  createdAt: string;
}

/** 05-timesheets.md — activity is free text; no project/client master data exists yet. */
export interface TimesheetEntry {
  id: string;
  employeeId: string;
  employee: LeaveRequestEmployeeRef;
  date: string;
  hours: number;
  activity: string;
  status: string;
  approverId: string | null;
  decisionNote: string | null;
  decidedAt: string | null;
  createdAt: string;
}

export interface CreateTimesheetEntryInput {
  date: string;
  hours: number;
  activity: string;
}

/** 06-overtime.md — payableAmount is an estimate, set only on approval. */
export interface OvertimeRequest {
  id: string;
  employeeId: string;
  employee: LeaveRequestEmployeeRef;
  date: string;
  hoursRequested: number;
  reason: string | null;
  settlementType: "Payable" | "CompOff";
  status: string;
  approverId: string | null;
  payableAmount: number | null;
  compOffDaysCredited: number | null;
  decisionNote: string | null;
  decidedAt: string | null;
  createdAt: string;
}

export interface CreateOvertimeRequestInput {
  date: string;
  hoursRequested: number;
  reason?: string;
  settlementType?: "Payable" | "CompOff";
}

/** Wave 2 W2·E10 deepening (05-compliance-calendar.md) — monthly obligations only. */
export interface ComplianceObligation {
  id: string;
  code: string;
  name: string;
  category: "PF" | "ESIC" | "TDS" | "PT" | "Custom";
  dueDayOfMonth: number;
  reminderDaysBefore: number;
  isActive: boolean;
}

export interface CreateObligationInput {
  code: string;
  name: string;
  category: "PF" | "ESIC" | "TDS" | "PT" | "Custom";
  dueDayOfMonth: number;
  reminderDaysBefore?: number;
}

export interface ComplianceTask {
  id: string;
  obligationId: string;
  obligation: ComplianceObligation;
  periodLabel: string;
  dueDate: string;
  status: "Open" | "Completed" | "Overdue" | "Waived";
  completedByUserId: string | null;
  completedAt: string | null;
  evidenceFileId: string | null;
  note: string | null;
  createdAt: string;
}

export interface StatutoryComplianceSettings {
  id: string | null;
  minimumWageThreshold: number;
  lwfEmployeeContribution: number;
  lwfEmployerContribution: number;
  lwfFrequencyMonths: number;
  bonusEligibilityCeiling: number;
  bonusPercent: number;
}

export interface UpdateStatutorySettingsInput {
  minimumWageThreshold?: number;
  lwfEmployeeContribution?: number;
  lwfEmployerContribution?: number;
  lwfFrequencyMonths?: number;
  bonusEligibilityCeiling?: number;
  bonusPercent?: number;
}

export interface MinimumWageCheckRow {
  employeeId: string;
  employeeCode: string;
  legalName: string;
  monthlyBasic: number;
  threshold: number;
  violation: boolean;
}

export interface LwfLiability {
  activeEmployeeCount: number;
  employeeContribution: number;
  employerContribution: number;
  totalLiability: number;
  frequencyMonths: number;
}

export interface BonusEligibilityRow {
  employeeId: string;
  employeeCode: string;
  legalName: string;
  monthlyBasic: number;
  eligible: boolean;
  bonusAmount: number;
}

/** Wave 2 W2·E27 Integration Platform (02-webhooks.md) — outbound event delivery. */
export interface WebhookSubscription {
  id: string;
  url: string;
  secret: string;
  eventTypes: string[];
  isActive: boolean;
  createdAt: string;
}

export interface CreateWebhookSubscriptionInput {
  url: string;
  eventTypes: string[];
}

export interface WebhookDelivery {
  id: string;
  subscriptionId: string;
  eventType: string;
  responseStatus: number | null;
  success: boolean;
  errorMessage: string | null;
  attemptedAt: string;
}

/** Wave 4 W4·E15 Employee Experience — surveys (incl. pulse, type-tagged) and peer recognition. */
export interface SurveyQuestion {
  id: string;
  text: string;
  type: "Rating" | "Text";
  sortOrder: number;
}

export interface Survey {
  id: string;
  title: string;
  description: string | null;
  type: "Standard" | "Pulse";
  isAnonymous: boolean;
  status: "Draft" | "Published" | "Closed";
  questions: SurveyQuestion[];
  publishedAt: string | null;
  closesAt: string | null;
  closedAt: string | null;
  createdAt: string;
}

export interface SurveyWithResponseFlag extends Survey {
  hasResponded: boolean;
}

export interface CreateSurveyInput {
  title: string;
  description?: string;
  type?: "Standard" | "Pulse";
  isAnonymous?: boolean;
  questions: { text: string; type: "Rating" | "Text" }[];
}

export interface SubmitSurveyResponseInput {
  answers: { questionId: string; ratingValue?: number; textValue?: string }[];
}

export interface SurveyQuestionResult {
  questionId: string;
  text: string;
  type: "Rating" | "Text";
  averageRating?: number | null;
  responseCount?: number;
  textAnswers?: string[];
}

export interface SurveyResults {
  surveyId: string;
  title: string;
  isAnonymous: boolean;
  responseCount: number;
  questionResults: SurveyQuestionResult[];
}

export interface Recognition {
  id: string;
  fromEmployee: { id: string; legalName: string };
  toEmployee: { id: string; legalName: string };
  value: string;
  message: string;
  points: number;
  createdAt: string;
}

export interface GiveRecognitionInput {
  toEmployeeId: string;
  value: string;
  message: string;
  points?: number;
}

/** Wave 4 W4·E19 Helpdesk and Case Management — tickets, SLA policies, and a knowledge base. */
export interface TicketComment {
  id: string;
  ticketId: string;
  authorUserId: string;
  body: string;
  isInternal: boolean;
  createdAt: string;
}

export interface Ticket {
  id: string;
  employee: { id: string; legalName: string };
  assignedAgent: { id: string; legalName: string } | null;
  queue: "HR" | "IT" | "Admin" | "Finance";
  category: string;
  subject: string;
  description: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Open" | "Assigned" | "InProgress" | "Resolved" | "Closed";
  isEscalated: boolean;
  dueAt: string | null;
  resolvedAt: string | null;
  closedAt: string | null;
  satisfactionRating: number | null;
  createdAt: string;
}

export interface TicketWithComments extends Ticket {
  comments: TicketComment[];
}

export interface CreateTicketInput {
  queue: Ticket["queue"];
  category: string;
  subject: string;
  description: string;
  priority?: Ticket["priority"];
}

export interface AddCommentInput {
  body: string;
  isInternal?: boolean;
}

export interface CloseTicketInput {
  satisfactionRating?: number;
}

export interface SlaPolicy {
  id: string;
  queue: string;
  priority: string;
  resolutionHours: number;
}

export interface CreateSlaPolicyInput {
  queue: string;
  priority: string;
  resolutionHours: number;
}

export interface KnowledgeArticle {
  id: string;
  queue: string;
  title: string;
  body: string;
  isPublished: boolean;
  createdAt: string;
}

export interface CreateKnowledgeArticleInput {
  queue: string;
  title: string;
  body: string;
  isPublished?: boolean;
}

/** Wave 4 W4·E20 Contractor and External Workforce — vendors, external workers, compliance documents. Admin-only, no self-service surface. */
export interface Vendor {
  id: string;
  name: string;
  contactEmail: string | null;
  contactPhone: string | null;
  isActive: boolean;
}

export interface CreateVendorInput {
  name: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface ExternalWorkerDocument {
  id: string;
  externalWorkerId: string;
  documentType: string;
  fileId: string | null;
  isVerified: boolean;
  verifiedAt: string | null;
  createdAt: string;
}

export interface ExternalWorker {
  id: string;
  vendor: { id: string; name: string };
  fullName: string;
  email: string | null;
  category: "Contractor" | "Consultant" | "AgencyStaff" | "Intern";
  status: "Draft" | "PendingApproval" | "Active" | "Expired" | "Suspended" | "Inactive";
  contractStartDate: string;
  contractEndDate: string;
  departmentId: string | null;
  workLocation: string | null;
  accessGrantedAt: string | null;
  accessRevokedAt: string | null;
  statusReason: string | null;
  createdAt: string;
}

export interface ExternalWorkerWithDocuments extends ExternalWorker {
  documents: ExternalWorkerDocument[];
}

export interface CreateWorkerInput {
  vendorId: string;
  fullName: string;
  email?: string;
  category?: ExternalWorker["category"];
  contractStartDate: string;
  contractEndDate: string;
  departmentId?: string;
  workLocation?: string;
}

export interface AddDocumentInput {
  documentType: string;
  fileId: string;
}

/** Wave 4 W4·E23 Communication Platform — announcements collapse news/bulletin-board/campaigns into one type-tagged entity. */
export interface Announcement {
  id: string;
  title: string;
  body: string;
  category: "Policy" | "Event" | "Holiday" | "General" | "Urgent";
  status: "Draft" | "Published" | "Archived";
  publishedAt: string | null;
  archivedAt: string | null;
  createdAt: string;
}

export interface CreateAnnouncementInput {
  title: string;
  body: string;
  category?: Announcement["category"];
}

/** Wave 4 W4·E15 gap closure ("employee communications") — comments on Announcement. */
export interface AnnouncementComment {
  id: string;
  employee: { id: string; legalName: string };
  body: string;
  createdAt: string;
}

/** Wave 4 W4·E15 gap closure ("rewards") — redemption catalog behind Recognition's points counter. */
export interface RewardCatalogItem {
  id: string;
  name: string;
  description: string | null;
  pointsCost: number;
  active: boolean;
  createdAt: string;
}

export interface CreateRewardItemInput {
  name: string;
  description?: string;
  pointsCost: number;
}

export interface RewardRedemption {
  id: string;
  rewardItem: { id: string; name: string; pointsCost: number };
  employee: { id: string; legalName: string; employeeCode: string };
  pointsSpent: number;
  status: "Requested" | "Fulfilled" | "Cancelled";
  decisionNote: string | null;
  fulfilledAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
}

export interface RewardBalance {
  pointsReceived: number;
  pointsSpent: number;
  pointsAvailable: number;
}

/** Wave 4 W4·E15 gap closure ("communities"). */
export interface Community {
  id: string;
  name: string;
  description: string | null;
  category: string;
  status: "Active" | "Archived";
  isMember: boolean;
  createdAt: string;
}

export interface CreateCommunityInput {
  name: string;
  description?: string;
  category?: string;
}

/** Wave 4 W4·E15 gap closure ("social feed") — text-only, no photo uploads. */
export interface FeedComment {
  id: string;
  employee: { id: string; legalName: string };
  body: string;
  createdAt: string;
}

export interface FeedPost {
  id: string;
  employee: { id: string; legalName: string };
  communityId: string | null;
  body: string;
  comments: FeedComment[];
  _count: { likes: number };
  createdAt: string;
}

export interface CreatePostInput {
  body: string;
  communityId?: string;
}

/** Wave 4 W4·E15 gap closure ("events") — company/team events with RSVP. */
export interface ExperienceEvent {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  startAt: string;
  status: "Draft" | "Published" | "Cancelled";
  _count: { rsvps: number };
  createdAt: string;
}

export interface CreateEventInput {
  title: string;
  description?: string;
  location?: string;
  startAt: string;
}

export interface EventRsvp {
  id: string;
  eventId: string;
  employeeId: string;
  response: "Going" | "Interested" | "Declined";
}

/** Wave 4 W4·E15 gap closure ("wellness programs") — mirrors LearningCourse/Enrollment. */
export interface WellnessProgram {
  id: string;
  title: string;
  description: string | null;
  category: "Fitness" | "MentalHealth" | "Nutrition" | "Other";
  startDate: string;
  endDate: string | null;
  status: "Active" | "Closed";
  isEnrolled: boolean;
  _count: { enrollments: number };
  createdAt: string;
}

export interface CreateWellnessProgramInput {
  title: string;
  description?: string;
  category?: WellnessProgram["category"];
  startDate: string;
  endDate?: string;
}


/** Wave 4 W4·E21 Visitor and Workplace Management — a gate pass IS the visitor record. */
export interface Visitor {
  id: string;
  fullName: string;
  company: string | null;
  phone: string | null;
  email: string | null;
  purpose: string | null;
  hostEmployeeId: string;
  hostEmployee: { id: string; legalName: string; employeeCode: string };
  scheduledAt: string;
  status: "Requested" | "Approved" | "CheckedIn" | "CheckedOut" | "Cancelled" | "Expired";
  approvedAt: string | null;
  checkedInAt: string | null;
  checkedOutAt: string | null;
  createdAt: string;
}

export interface CreateVisitorInput {
  fullName: string;
  company?: string;
  phone?: string;
  email?: string;
  purpose?: string;
  scheduledAt: string;
}

/** Desk/Room/Parking/Shuttle/Cafeteria collapse into one type-tagged resource catalog. */
export interface WorkplaceResource {
  id: string;
  type: "Desk" | "Room" | "Parking" | "Shuttle" | "Cafeteria";
  name: string;
  location: string | null;
  capacity: number;
  isActive: boolean;
}

export interface CreateResourceInput {
  type: WorkplaceResource["type"];
  name: string;
  location?: string;
  capacity?: number;
}

export interface WorkplaceBooking {
  id: string;
  resourceId: string;
  resource: { id: string; type: string; name: string; capacity: number };
  employeeId: string;
  employee: { id: string; legalName: string; employeeCode: string };
  bookingDate: string;
  notes: string | null;
  status: "Confirmed" | "Cancelled";
  createdAt: string;
}

export interface CreateBookingInput {
  resourceId: string;
  bookingDate: string;
  notes?: string;
}

/** Wave 4 W4·E22 Health Safety and Wellness. State machine collapsed 5→4: spec's
 * ActionAssigned folds into UnderReview's investigationNotes field. */
export interface SafetyIncident {
  id: string;
  reportedByEmployeeId: string;
  reportedByEmployee: { id: string; legalName: string; employeeCode: string };
  incidentDate: string;
  location: string;
  description: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "Reported" | "UnderReview" | "Resolved" | "Closed";
  investigationNotes: string | null;
  resolvedAt: string | null;
  closedAt: string | null;
  createdAt: string;
}

export interface CreateSafetyIncidentInput {
  incidentDate: string;
  location: string;
  description: string;
  severity?: SafetyIncident["severity"];
}

/** Audits/risk assessments/drills collapse into one type-tagged assessment entity. */
export interface SafetyAssessment {
  id: string;
  type: "Audit" | "RiskAssessment" | "Drill";
  location: string;
  assessedDate: string;
  conductedByEmployeeId: string | null;
  conductedByEmployee: { id: string; legalName: string; employeeCode: string } | null;
  findings: string | null;
  riskLevel: "Low" | "Medium" | "High";
  status: "Scheduled" | "Completed";
  createdAt: string;
}

export interface CreateSafetyAssessmentInput {
  type: SafetyAssessment["type"];
  location: string;
  assessedDate: string;
  conductedByEmployeeId?: string;
}

export interface CompleteSafetyAssessmentInput {
  findings?: string;
  riskLevel: "Low" | "Medium" | "High";
}

/** Checkups/vaccinations/occupational-health reviews collapse into one type-tagged
 * flat record catalog per employee — mirrors CertificationRecord's shape. */
export interface HealthRecord {
  id: string;
  employeeId: string;
  employee: { id: string; legalName: string; employeeCode: string };
  type: "MedicalCheckup" | "Vaccination" | "OccupationalHealthReview";
  recordDate: string;
  provider: string | null;
  notes: string | null;
  nextDueDate: string | null;
  evidenceFileId: string | null;
  createdAt: string;
}

export interface CreateHealthRecordInput {
  employeeId?: string;
  type: HealthRecord["type"];
  recordDate: string;
  provider?: string;
  notes?: string;
  nextDueDate?: string;
  evidenceFileId?: string;
}

/** Admin-managed "who to call" directory — distinct from the per-employee
 * EmergencyContact (People Management's personal next-of-kin record). */
export interface EmergencyResponseContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  category: "Fire" | "Medical" | "Security" | "Facilities" | "Other";
  isActive: boolean;
  createdAt: string;
}

export interface CreateEmergencyResponseContactInput {
  name: string;
  role: string;
  phone: string;
  category?: EmergencyResponseContact["category"];
}

/** Wave 4 W4·E24 Document Management. State machine collapsed 6→4: Signed drops
 * entirely (no e-signature vendor), Generated+Shared merge into Published. */
export interface DocumentVersionSummary {
  id: string;
  versionNumber: number;
  fileId: string;
  uploadedByUserId: string;
  notes: string | null;
  createdAt: string;
}

export interface DocumentRecord {
  id: string;
  employeeId: string | null;
  employee: { id: string; legalName: string; employeeCode: string } | null;
  title: string;
  category: "Policy" | "Contract" | "Certificate" | "Form" | "Report" | "Other";
  status: "Draft" | "Published" | "Archived" | "Expired";
  retentionPolicyId: string | null;
  createdByUserId: string;
  publishedAt: string | null;
  archivedAt: string | null;
  expiredAt: string | null;
  createdAt: string;
  versions: DocumentVersionSummary[];
}

export interface CreateDocumentInput {
  title: string;
  category?: DocumentRecord["category"];
  employeeId?: string;
  retentionPolicyId?: string;
  fileId: string;
  notes?: string;
}

export interface AddDocumentVersionInput {
  fileId: string;
  notes?: string;
}

export interface RetentionPolicy {
  id: string;
  name: string;
  category: "All" | "Policy" | "Contract" | "Certificate" | "Form" | "Report" | "Other";
  retentionMonths: number;
  createdAt: string;
}

export interface CreateRetentionPolicyInput {
  name: string;
  category?: RetentionPolicy["category"];
  retentionMonths: number;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  description: string | null;
  updatedAt: string;
}

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string | null;
  enabled: boolean;
  updatedAt: string;
}

export const CONSENT_PURPOSES = [
  "BackgroundVerification",
  "DataSharingThirdParty",
  "MarketingCommunications",
  "Photography",
  "Other",
] as const;
export type ConsentPurpose = (typeof CONSENT_PURPOSES)[number];

export interface ConsentRecord {
  id: string;
  purpose: string;
  status: "Granted" | "Revoked";
  grantedAt: string;
  revokedAt: string | null;
  notes: string | null;
  employee?: { legalName: string };
}

export interface ComplianceOverview {
  complianceTasks: { open: number; overdue: number };
  accessReview: { id: string; periodLabel: string; totalItems: number; pendingItems: number } | null;
  consent: { total: number; revoked: number };
}

export interface UpsertSystemSettingInput {
  value: string;
  description?: string;
}

export interface NumberSeries {
  id: string;
  entityType: string;
  prefix: string;
  padding: number;
  nextValue: number;
  updatedAt: string;
}

export interface UpdateNumberSeriesInput {
  prefix?: string;
  padding?: number;
}
