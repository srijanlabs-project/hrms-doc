import { IsArray } from "class-validator";

/**
 * Row contents are validated per-row inside EmployeeService.bulkCreate, not
 * by the global ValidationPipe — a whole-request 422 on the first bad row
 * would defeat the point of a bulk tool. This DTO only guarantees `rows` is
 * an array; each element's shape is checked (and reported independently)
 * against CreateEmployeeDto's own rules at import time.
 */
export class BulkImportEmployeesDto {
  @IsArray()
  rows!: Record<string, unknown>[];
}
