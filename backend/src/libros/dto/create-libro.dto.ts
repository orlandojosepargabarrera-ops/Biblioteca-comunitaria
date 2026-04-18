import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  MaxLength,
} from 'class-validator';
import { Genero } from '@prisma/client';

export class CreateLibroDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @MaxLength(200)
  titulo: string;

  @IsString()
  @IsNotEmpty({ message: 'El autor es obligatorio' })
  @MaxLength(150)
  autor: string;

  @IsEnum(Genero, { message: 'Género no válido' })
  genero: Genero;

  @IsString()
  @IsNotEmpty({ message: 'El ISBN es obligatorio' })
  @MaxLength(20)
  isbn: string;

  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'Debe haber al menos 1 ejemplar' })
  totalEjemplares: number;
}
