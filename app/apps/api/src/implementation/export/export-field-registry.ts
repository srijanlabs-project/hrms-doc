export const EXPORTABLE_ENTITY_TYPES = ["Employee", "Department", "LegalEntity", "LeavePolicy"] as const;
export type ExportableEntityType = (typeof EXPORTABLE_ENTITY_TYPES)[number];

/** Same four entity types the import engine supports (IMPORTABLE_ENTITY_TYPES), read-side. Fixed column lists rather than a dynamic field-allowlist like the custom-report builder — these are the whole master-data record, not a user-chosen slice. */
export const EXPORT_FIELDS: Record<ExportableEntityType, string[]> = {
  Employee: [
    "employeeCode",
    "legalName",
    "preferredName",
    "personalEmail",
    "mobileNumber",
    "status",
    "workerType",
    "joiningDate",
    "lastWorkingDay",
  ],
  Department: ["code", "name", "status"],
  LegalEntity: ["code", "name", "country", "status"],
  LeavePolicy: ["leaveType", "name", "annualDays", "status"],
};
