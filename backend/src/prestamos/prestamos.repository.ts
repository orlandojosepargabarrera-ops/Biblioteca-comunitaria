import { Injectable } from '@nestjs/common';
import { EstadoPrestamo, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PrestamoMapper } from './mappers/prestamo.mapper';
import { PrestamoEntity } from '../prestamos/entities/prestamo.entity';

@Injectable()
export class PrestamosRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crea el préstamo y descuenta disponibilidad del libro
   * dentro de una transacción atómica.
   */
  async crearConDescuento(
    data: Prisma.PrestamoUncheckedCreateInput,
  ): Promise<PrestamoEntity> {
    const prestamo = await this.prisma.$transaction(async (tx) => {
      const libro = await tx.libro.findUnique({
        where: { id: data.libroId },
      });
      if (!libro) throw new Error('Libro no encontrado');
      if (libro.disponibles <= 0) throw new Error('Sin ejemplares disponibles');

      await tx.libro.update({
        where: { id: data.libroId },
        data: { disponibles: { decrement: 1 } },
      });

      return tx.prestamo.create({
        data,
        include: { libro: true, socio: true },
      });
    });

    return PrestamoMapper.toDomain(prestamo);
  }

  /**
   * Marca el préstamo como devuelto y suma disponibilidad del libro
   * dentro de una transacción.
   */
  async marcarDevueltoConIncremento(
    id: number,
    observaciones?: string,
  ): Promise<PrestamoEntity> {
    const prestamo = await this.prisma.$transaction(async (tx) => {
      const actual = await tx.prestamo.findUnique({ where: { id } });
      if (!actual) throw new Error('Préstamo no encontrado');
      if (actual.estado === EstadoPrestamo.DEVUELTO) {
        throw new Error('El préstamo ya fue devuelto');
      }

      await tx.libro.update({
        where: { id: actual.libroId },
        data: { disponibles: { increment: 1 } },
      });

      return tx.prestamo.update({
        where: { id },
        data: {
          estado: EstadoPrestamo.DEVUELTO,
          fechaDevuelto: new Date(),
          ...(observaciones !== undefined && { observaciones }),
        },
        include: { libro: true, socio: true },
      });
    });

    return PrestamoMapper.toDomain(prestamo);
  }

  async listar(): Promise<PrestamoEntity[]> {
    const prestamos = await this.prisma.prestamo.findMany({
      orderBy: { fechaPrestamo: 'desc' },
      include: { libro: true, socio: true },
    });
    return prestamos.map(PrestamoMapper.toDomain);
  }

  async buscarPorId(id: number): Promise<PrestamoEntity | null> {
    const p = await this.prisma.prestamo.findUnique({
      where: { id },
      include: { libro: true, socio: true },
    });
    return p ? PrestamoMapper.toDomain(p) : null;
  }

  /** CU-05: préstamos activos con fecha de devolución vencida. */
  async listarVencidos(ahora: Date = new Date()): Promise<PrestamoEntity[]> {
    const prestamos = await this.prisma.prestamo.findMany({
      where: {
        estado: EstadoPrestamo.ACTIVO,
        fechaDevolucion: { lt: ahora },
      },
      orderBy: { fechaDevolucion: 'asc' },
      include: { libro: true, socio: true },
    });
    return prestamos.map(PrestamoMapper.toDomain);
  }

  /** CU-05: socios con al menos un préstamo activo (devolución pendiente). */
  async listarSociosConPendientes(): Promise<
    { socioId: number; pendientes: number }[]
  > {
    const agrupado = await this.prisma.prestamo.groupBy({
      by: ['socioId'],
      where: { estado: EstadoPrestamo.ACTIVO },
      _count: { _all: true },
    });
    return agrupado.map((g) => ({
      socioId: g.socioId,
      pendientes: g._count._all,
    }));
  }
}
