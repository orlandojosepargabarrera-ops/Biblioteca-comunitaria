import { Prestamo as PrestamoPrisma, Libro, Socio } from '@prisma/client';
import { PrestamoEntity } from '../entities/prestamo.entity';

type PrestamoConRelaciones = PrestamoPrisma & {
  libro?: Libro;
  socio?: Socio;
};

export class PrestamoMapper {
  static toDomain(p: PrestamoConRelaciones): PrestamoEntity {
    return new PrestamoEntity({
      id: p.id,
      libroId: p.libroId,
      socioId: p.socioId,
      fechaPrestamo: p.fechaPrestamo,
      fechaDevolucion: p.fechaDevolucion,
      fechaDevuelto: p.fechaDevuelto,
      estado: p.estado,
      observaciones: p.observaciones,
      libro: p.libro
        ? {
            id: p.libro.id,
            titulo: p.libro.titulo,
            autor: p.libro.autor,
            isbn: p.libro.isbn,
          }
        : undefined,
      socio: p.socio
        ? {
            id: p.socio.id,
            nombre: p.socio.nombre,
            apellido: p.socio.apellido,
            documento: p.socio.documento,
          }
        : undefined,
    });
  }

  static toHttp(p: PrestamoEntity) {
    return {
      id: p.id,
      libroId: p.libroId,
      socioId: p.socioId,
      fechaPrestamo: p.fechaPrestamo,
      fechaDevolucion: p.fechaDevolucion,
      fechaDevuelto: p.fechaDevuelto,
      estado: p.estado,
      observaciones: p.observaciones,
      estaVencido: p.estaVencido(),
      diasDeAtraso: p.diasDeAtraso(),
      libro: p.libro,
      socio: p.socio,
    };
  }
}
