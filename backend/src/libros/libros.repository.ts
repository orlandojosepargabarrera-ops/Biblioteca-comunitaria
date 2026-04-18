import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { LibroMapper } from './mappers/libro.mapper';
import { LibroEntity } from './entities/libro.entity';

/**
 * Capa Repository: única capa que conoce a Prisma.
 * Devuelve siempre entidades de dominio, nunca modelos de Prisma.
 */
@Injectable()
export class LibrosRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(data: Prisma.LibroCreateInput): Promise<LibroEntity> {
    const creado = await this.prisma.libro.create({ data });
    return LibroMapper.toDomain(creado);
  }

  async listar(): Promise<LibroEntity[]> {
    const libros = await this.prisma.libro.findMany({
      orderBy: { creadoEn: 'desc' },
    });
    return libros.map(LibroMapper.toDomain);
  }

  async buscarPorId(id: number): Promise<LibroEntity | null> {
    const libro = await this.prisma.libro.findUnique({ where: { id } });
    return libro ? LibroMapper.toDomain(libro) : null;
  }

  async buscarPorIsbn(isbn: string): Promise<LibroEntity | null> {
    const libro = await this.prisma.libro.findUnique({ where: { isbn } });
    return libro ? LibroMapper.toDomain(libro) : null;
  }

  async actualizar(
    id: number,
    data: Prisma.LibroUpdateInput,
  ): Promise<LibroEntity> {
    const actualizado = await this.prisma.libro.update({ where: { id }, data });
    return LibroMapper.toDomain(actualizado);
  }

  async eliminar(id: number): Promise<void> {
    await this.prisma.libro.delete({ where: { id } });
  }

  async ajustarDisponibles(id: number, delta: number): Promise<LibroEntity> {
    const actualizado = await this.prisma.libro.update({
      where: { id },
      data: { disponibles: { increment: delta } },
    });
    return LibroMapper.toDomain(actualizado);
  }
}
