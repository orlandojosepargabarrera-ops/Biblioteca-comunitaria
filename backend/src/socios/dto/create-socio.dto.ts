import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { TipoSocio } from '@prisma/client';

export class CreateSocioDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(80)
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @MaxLength(80)
  apellido: string;

  @IsString()
  @IsNotEmpty({ message: 'El documento es obligatorio' })
  @MaxLength(30)
  documento: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  telefono?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Correo electrónico inválido' })
  @MaxLength(120)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  direccion?: string;

  @IsEnum(TipoSocio, {
    message: 'Tipo de socio inválido (ADULTO, JOVEN o INFANTIL)',
  })
  tipo: TipoSocio;
}
