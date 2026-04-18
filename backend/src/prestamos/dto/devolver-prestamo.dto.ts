import { IsOptional, IsString, MaxLength } from 'class-validator';

export class DevolverPrestamoDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  observaciones?: string;
}
