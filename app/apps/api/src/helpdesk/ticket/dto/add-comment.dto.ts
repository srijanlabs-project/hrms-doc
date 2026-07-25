import { IsBoolean, IsOptional, IsString, Length } from "class-validator";

export class AddCommentDto {
  @IsString()
  @Length(1, 2000)
  body!: string;

  /** Only honored for org_admin/hr_ops callers — silently forced to false for the raising employee. */
  @IsOptional()
  @IsBoolean()
  isInternal?: boolean;
}
