import { IsNotEmpty, IsString, Length } from "class-validator";

export class ResolveGrievanceCaseDto {
  @IsNotEmpty() @IsString() @Length(1, 2000) resolutionSummary!: string;
}
