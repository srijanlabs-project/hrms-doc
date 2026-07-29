import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";

const SUITE_TYPES = ["Regression", "Performance", "Security", "Accessibility", "UAT"] as const;

export class CreateTestSuiteDto {
  @IsNotEmpty() name!: string;
  @IsIn(SUITE_TYPES) suiteType!: (typeof SUITE_TYPES)[number];
  @IsOptional() @IsString() description?: string;
}

export { SUITE_TYPES as TEST_SUITE_TYPES };
