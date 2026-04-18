import { Libro as LibroPrisma } from '@prisma/client';
import { LibroEntity } from '../entities/libro.entity';

/**
 * Mapper: transforma datos entre capas.
 * - toDomain: modelo Prisma -> entidad de dominio
 * - toHttp: entidad de dominio -> objeto de respuesta HTTP
 */
export class LibroMapper {
  static toDomain(prismaLibro: LibroPrisma): LibroEntity {
    return new LibroEntity({
      id: prismaLibro.id,
      titulo: prismaLibro.titulo,
      autor: prismaLibro.autor,
      genero: prismaLibro.genero,
      isbn: prismaLibro.isbn,
      totalEjemplares: prismaLibro.totalEjemplares,
      disponibles: prismaLibro.disponibles,
      creadoEn: prismaLibro.creadoEn,
      actualizadoEn: prismaLibro.actualizadoEn,
    });
  }

  static toHttp(libro: LibroEntity) {
    return {
      id: libro.id,
      titulo: libro.titulo,
      autor: libro.autor,
      genero: libro.genero,
      isbn: libro.isbn,
      totalEjemplares: libro.totalEjemplares,
      disponibles: libro.disponibles,
      estaDisponible: libro.hayDisponibles(),
      creadoEn: libro.creadoEn,
      actualizadoEn: libro.actualizadoEn,
    };
  }
}
