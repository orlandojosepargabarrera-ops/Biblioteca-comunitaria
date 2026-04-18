import { EstadoPrestamo } from '@prisma/client';

/**
 * Entidad del dominio: Préstamo de un libro a un socio.
 * Contiene reglas de negocio como "está vencido" o "marcar como devuelto".
 */
export class PrestamoEntity {
  id: number;
  libroId: number;
  socioId: number;
  fechaPrestamo: Date;
  fechaDevolucion: Date;
  fechaDevuelto: Date | null;
  estado: EstadoPrestamo;
  observaciones: string | null;

  // Relaciones (opcionales, cargadas a demanda)
  libro?: {
    id: number;
    titulo: string;
    autor: string;
    isbn: string;
  };
  socio?: {
    id: number;
    nombre: string;
    apellido: string;
    documento: string;
  };

  constructor(props: Partial<PrestamoEntity>) {
    Object.assign(this, props);
  }

  /** Regla de dominio: ¿el préstamo está activo y además vencido? */
  estaVencido(ahora: Date = new Date()): boolean {
    return this.estado === 'ACTIVO' && this.fechaDevolucion < ahora;
  }

  /** Días de atraso (0 si no hay atraso o ya fue devuelto). */
  diasDeAtraso(ahora: Date = new Date()): number {
    if (this.estado !== 'ACTIVO' || this.fechaDevolucion >= ahora) return 0;
    const ms = ahora.getTime() - this.fechaDevolucion.getTime();
    return Math.ceil(ms / (1000 * 60 * 60 * 24));
  }
}
