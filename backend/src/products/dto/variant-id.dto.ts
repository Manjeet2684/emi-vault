import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class VariantIdDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  variantId: number;
}

