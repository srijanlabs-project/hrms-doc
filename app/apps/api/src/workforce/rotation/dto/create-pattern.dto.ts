import { ArrayMinSize, IsString, IsUUID, Length } from "class-validator";

export class CreatePatternDto {
  @IsString()
  @Length(1, 80)
  name!: string;

  /** Ordered — index 0 is week 0 of the cycle, index 1 is week 1, etc. */
  @IsUUID("4", { each: true })
  @ArrayMinSize(2)
  shiftIds!: string[];
}
