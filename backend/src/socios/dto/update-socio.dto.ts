import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { TipoSocio } from '@prisma/client';

export class UpdateSocioDto {
  @IsOptional() @IsString() @MaxLength(80) nombre?: string;
  @IsOptional() @IsString() @MaxLength(80) apellido?: string;
  @IsOptional() @IsString() @MaxLength(30) documento?: string;
  @IsOptional() @IsString() @MaxLength(30) telefono?: string;
  @IsOptional() @IsEmail() @MaxLength(120) email?: string;
  @IsOptional() @IsString() @MaxLength(200) direccion?: string;
  @IsOptional() @IsEnum(TipoSocio) tipo?: TipoSocio;
  @IsOptional() @IsBoolean() activo?: boolean;
}
