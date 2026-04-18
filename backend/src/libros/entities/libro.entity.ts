import { Genero } from '@prisma/client';

/**
 * Entidad del dominio: representa un libro del catálogo.
 * No depende de frameworks externos: solo reglas y datos del dominio.
 */
export class LibroEntity {
  id: number;
  titulo: string;
  autor: string;
  genero: Genero;
  isbn: string;
  totalEjemplares: number;
  disponibles: number;
  creadoEn: Date;
  actualizadoEn: Date;

  constructor(props: Partial<LibroEntity>) {
    Object.assign(this, props);
  }

  /** Regla de dominio: ¿hay al menos un ejemplar disponible? */
  hayDisponibles(): boolean {
    return this.disponibles > 0;
  }

  /** Regla de dominio: descuenta un ejemplar cuando se presta. */
  prestarUnEjemplar(): void {
    if (!this.hayDisponibles()) {
      throw new Error('No hay ejemplares disponibles para prestar');
    }
    this.disponibles -= 1;
  }

  /** Regla de dominio: suma un ejemplar cuando se devuelve. */
  devolverUnEjemplar(): void {
    if (this.disponibles >= this.totalEjemplares) {
      throw new Error('No se puede devolver: ya están todos los ejemplares');
    }
    this.disponibles += 1;
  }
}
