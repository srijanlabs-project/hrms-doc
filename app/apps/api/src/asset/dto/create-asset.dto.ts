import { IsIn, IsOptional, IsString, Length } from "class-validator";

const ASSET_CATEGORIES = ["Laptop", "Phone", "Monitor", "SimCard", "IdCard", "Peripheral", "Other"] as const;

export class CreateAssetDto {
  /** Auto-allocated from the Number Series engine's "Asset" series when omitted. */
  @IsOptional()
  @IsString()
  @Length(1, 60)
  assetTag?: string;

  @IsIn(ASSET_CATEGORIES)
  category!: (typeof ASSET_CATEGORIES)[number];

  @IsString()
  @Length(1, 120)
  name!: string;
}
