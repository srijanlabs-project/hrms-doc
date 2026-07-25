import { IsIn, IsNumber, IsString, Length } from "class-validator";

const COMPONENT_TYPES = ["Earning", "Deduction"] as const;
const CALCULATION_METHODS = ["FixedAmount", "PercentOfBasic"] as const;

export class CreatePayComponentDto {
  @IsString()
  @Length(1, 20)
  code!: string;

  @IsString()
  @Length(2, 80)
  name!: string;

  @IsIn(COMPONENT_TYPES)
  type!: (typeof COMPONENT_TYPES)[number];

  @IsIn(CALCULATION_METHODS)
  calculationMethod!: (typeof CALCULATION_METHODS)[number];

  @IsNumber()
  defaultValue!: number;
}
