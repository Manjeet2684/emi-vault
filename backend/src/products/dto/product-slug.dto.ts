import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ProductSlugDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/i, {
    message: 'slug must be a valid URL slug',
  })
  slug: string;
}

