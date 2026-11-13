
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  author!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  isbn?: string;

  @IsInt()
  @Min(0)
  totalCopies!: number;

  @IsInt()
  @Min(1)
  genreId!: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  publishedYear?: number;
}
