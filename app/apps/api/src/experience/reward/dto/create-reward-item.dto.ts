import { IsInt, IsOptional, IsPositive, IsString, Length } from "class-validator";

export class CreateRewardItemDto {
  @IsString() @Length(2, 160) name!: string;
  @IsOptional() @IsString() @Length(0, 500) description?: string;
  @IsInt() @IsPositive() pointsCost!: number;
}
