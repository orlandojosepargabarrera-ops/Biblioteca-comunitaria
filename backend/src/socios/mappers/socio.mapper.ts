import { Socio as SocioPrisma } from '@prisma/client';
import { SocioEntity } from '../entities/socio.entity';

export class SocioMapper {
  static toDomain(p: SocioPrisma): SocioEntity {
    return new SocioEntity({
      id: p.id,
      nombre: p.nombre,
      apellido: p.apellido,
      documento: p.documento,
      telefono: p.telefono,
      email: p.email,
      direccion: p.direccion,
      tipo: p.tipo,
      activo: p.activo,
      creadoEn: p.creadoEn,
      actualizadoEn: p.actualizadoEn,
    });
  }

  static toHttp(s: SocioEntity) {
    return {
      id: s.id,
      nombre: s.nombre,
      apellido: s.apellido,
      nombreCompleto: s.nombreCompleto,
      documento: s.documento,
      telefono: s.telefono,
      email: s.email,
      direccion: s.direccion,
      tipo: s.tipo,
      activo: s.activo,
      diasPrestamoPermitidos: s.diasPrestamoPermitidos(),
      creadoEn: s.creadoEn,
      actualizadoEn: s.actualizadoEn,
    };
  }
}
