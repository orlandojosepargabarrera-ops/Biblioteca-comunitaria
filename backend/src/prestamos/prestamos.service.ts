import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrestamosRepository } from './prestamos.repository';
import { LibrosService } from '../libros/libros.service';
import { SociosService } from '../socios/socios.service';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { DevolverPrestamoDto } from './dto/devolver-prestamo.dto';
import { PrestamoEntity } from './entities/prestamo.entity';
import { SocioMapper } from '../socios/mappers/socio.mapper';

@Injectable()
export class PrestamosService {
  constructor(
    private readonly repo: PrestamosRepository,
    private readonly librosService: LibrosService,
    private readonly sociosService: SociosService,
  ) {}

  /**
   * CU-03: Realizar préstamo. Verifica disponibilidad y asigna fecha de
   * devolución según el tipo de socio (o un valor manual).
   */
  async realizarPrestamo(dto: CreatePrestamoDto): Promise<PrestamoEntity> {
    const libro = await this.librosService.buscarPorId(dto.libroId);
    if (!libro.hayDisponibles()) {
      throw new ConflictException(
        `No hay ejemplares disponibles del libro "${libro.titulo}"`,
      );
    }

    const socio = await this.sociosService.buscarPorId(dto.socioId);
    if (!socio.activo) {
      throw new BadRequestException('El socio no está activo');
    }

    const dias = dto.diasPrestamo ?? socio.diasPrestamoPermitidos();
    const fechaDevolucion = new Date();
    fechaDevolucion.setDate(fechaDevolucion.getDate() + dias);

    try {
      return await this.repo.crearConDescuento({
        libroId: dto.libroId,
        socioId: dto.socioId,
        fechaDevolucion,
        observaciones: dto.observaciones,
      });
    } catch (e: any) {
      throw new ConflictException(e.message ?? 'No fue posible crear el préstamo');
    }
  }

  /**
   * CU-04: Registrar devolución. Actualiza disponibilidad automáticamente.
   */
  async registrarDevolucion(
    id: number,
    dto: DevolverPrestamoDto,
  ): Promise<PrestamoEntity> {
    const actual = await this.repo.buscarPorId(id);
    if (!actual) throw new NotFoundException(`Préstamo ${id} no existe`);
    if (actual.estado === 'DEVUELTO') {
      throw new ConflictException('El préstamo ya fue devuelto');
    }
    return this.repo.marcarDevueltoConIncremento(id, dto.observaciones);
  }

  listar(): Promise<PrestamoEntity[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: number): Promise<PrestamoEntity> {
    const p = await this.repo.buscarPorId(id);
    if (!p) throw new NotFoundException(`Préstamo ${id} no existe`);
    return p;
  }

  /** CU-05: libros con préstamos vencidos. */
  listarVencidos(): Promise<PrestamoEntity[]> {
    return this.repo.listarVencidos();
  }

  /** CU-05: socios con devoluciones pendientes. */
  async listarSociosConPendientes() {
    const pendientes = await this.repo.listarSociosConPendientes();
    const result: { socio: ReturnType<typeof SocioMapper.toHttp>; pendientes: number }[] = [];
    for (const item of pendientes) {
      const socio = await this.sociosService.buscarPorId(item.socioId);
      result.push({
        socio: SocioMapper.toHttp(socio),
        pendientes: item.pendientes,
      });
    }
    return result;
  }
}
