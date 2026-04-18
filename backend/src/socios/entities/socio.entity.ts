import { TipoSocio } from '@prisma/client';

/**
 * Entidad de dominio: Socio de la biblioteca.
 */
export class SocioEntity {
  id: number;
  nombre: string;
  apellido: string;
  documento: string;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  tipo: TipoSocio;
  activo: boolean;
  creadoEn: Date;
  actualizadoEn: Date;

  constructor(props: Partial<SocioEntity>) {
    Object.assign(this, props);
  }

  get nombreCompleto(): string {
    return `${this.nombre} ${this.apellido}`.trim();
  }

  /** Regla de dominio: ¿cuántos días máximos de préstamo según su tipo? */
  diasPrestamoPermitidos(): number {
    switch (this.tipo) {
      case 'ADULTO':
        return 15;
      case 'JOVEN':
        return 10;
      case 'INFANTIL':
        return 7;
      default:
        return 7;
    }
  }
}
