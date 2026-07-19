import { Module } from "@nestjs/common";
import { OrgModule } from "../org/org.module";
import { EmployeeController } from "./employee/employee.controller";
import { EmployeeRepository } from "./employee/employee.repository";
import { EmployeeService } from "./employee/employee.service";

/** People Core service boundary — docs/03-module-specifications/02-people-management.md. */
@Module({
  imports: [OrgModule],
  controllers: [EmployeeController],
  providers: [EmployeeService, EmployeeRepository],
})
export class PeopleModule {}
