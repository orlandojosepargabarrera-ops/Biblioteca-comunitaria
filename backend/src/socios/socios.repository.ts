import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SocioMapper } from './mappers/socio.mapper';
import { SocioEntity } from './entities/socio.entity';

@Injectable()
export class SociosRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(data: Prisma.SocioCreateInput): Promise<SocioEntity> {
    const creado = await this.prisma.socio.create({ data });
    return SocioMapper.toDomain(creado);
  }

  async listar(): Promise<SocioEntity[]> {
    const socios = await this.prisma.socio.findMany({
      orderBy: { apellido: 'asc' },
    });
    return socios.map(SocioMapper.toDomain);
  }

  async buscarPorId(id: number): Promise<SocioEntity | null> {
    const s = await this.prisma.socio.findUnique({ where: { id } });
    return s ? SocioMapper.toDomain(s) : null;
  }

  async buscarPorDocumento(documento: string): Promise<SocioEntity | null> {
    const s = await this.prisma.socio.findUnique({ where: { documento } });
    return s ? SocioMapper.toDomain(s) : null;
  }

  async actualizar(
    id: number,
    data: Prisma.SocioUpdateInput,
  ): Promise<SocioEntity> {
    const s = await this.prisma.socio.update({ where: { id }, data });
    return SocioMapper.toDomain(s);
  }

  async eliminar(id: number): Promise<void> {
    await this.prisma.socio.delete({ where: { id } });
  }
}
