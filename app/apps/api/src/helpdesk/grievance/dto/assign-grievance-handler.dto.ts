import { IsUUID } from "class-validator";

export class AssignGrievanceHandlerDto {
  @IsUUID() handlerEmployeeId!: string;
}
