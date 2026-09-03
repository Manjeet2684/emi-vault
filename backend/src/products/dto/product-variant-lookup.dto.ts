import { Type } from 'class-transformer';
import { Matches, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class ProductVariantLookupDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/i)
  slug: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  variantId: number;
}

