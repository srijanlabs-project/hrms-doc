export const REPORTABLE_ENTITY_TYPES = ["Employee", "LeaveRequest", "PayrollRunResult"] as const;
export type ReportableEntityType = (typeof REPORTABLE_ENTITY_TYPES)[number];

/**
 * Read-side analog of ImportEngineService's IMPORTABLE_ENTITY_TYPES registry:
 * an allowlist of scalar fields per entity type, so the custom-report engine
 * can build a dynamic Prisma `select`/`where` without ever exposing a raw
 * client-supplied field name to the query. Relation traversal and date-range
 * filters are deliberately out of scope — filters are equality-only on these
 * same allowlisted scalar fields.
 */
export const REPORT_FIELD_REGISTRY: Record<ReportableEntityType, string[]> = {
  Employee: [
    "id",
    "employeeCode",
    "legalName",
    "preferredName",
    "personalEmail",
    "mobileNumber",
    "status",
    "workerType",
    "joiningDate",
    "lastWorkingDay",
    "departmentId",
    "positionId",
    "gradeId",
    "designationId",
    "createdAt",
  ],
  LeaveRequest: [
    "id",
    "employeeId",
    "leaveType",
    "startDate",
    "endDate",
    "days",
    "status",
    "reason",
    "approverId",
    "createdAt",
  ],
  PayrollRunResult: [
    "id",
    "payrollRunId",
    "employeeId",
    "payableDays",
    "totalWorkingDays",
    "basic",
    "hra",
    "specialAllowance",
    "grossEarnings",
    "pfEmployee",
    "pfEmployer",
    "esicEmployee",
    "esicEmployer",
    "professionalTax",
    "tds",
    "otherDeductions",
    "arrearsIncluded",
    "netPay",
    "hasException",
    "createdAt",
  ],
};

export const REPORT_ROW_LIMIT = 500;
