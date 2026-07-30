import { ArrayNotEmpty, ArrayUnique, IsArray, IsIn } from "class-validator";
import { ASSIGNABLE_ROLES, type AssignableRole } from "./provision-login.dto";

export class UpdateRolesDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsIn(ASSIGNABLE_ROLES, { each: true })
  roles!: AssignableRole[];
}
