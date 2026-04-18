import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePrestamoDto {
  @IsInt({ message: 'libroId debe ser un entero' })
  @IsPositive()
  libroId: number;

  @IsInt({ message: 'socioId debe ser un entero' })
  @IsPositive()
  socioId: number;

  /** Si no se envía, se calcula a partir del tipo de socio. */
  @IsOptional()
  @IsInt()
  @IsPositive()
  diasPrestamo?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  observaciones?: string;
}
