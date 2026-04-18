import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SociosRepository } from './socios.repository';
import { CreateSocioDto } from './dto/create-socio.dto';
import { UpdateSocioDto } from './dto/update-socio.dto';
import { SocioEntity } from './entities/socio.entity';

@Injectable()
export class SociosService {
  constructor(private readonly repo: SociosRepository) {}

  async crear(dto: CreateSocioDto): Promise<SocioEntity> {
    const existente = await this.repo.buscarPorDocumento(dto.documento);
    if (existente) {
      throw new ConflictException(
        `Ya existe un socio con documento ${dto.documento}`,
      );
    }
    return this.repo.crear({
      nombre: dto.nombre,
      apellido: dto.apellido,
      documento: dto.documento,
      telefono: dto.telefono,
      email: dto.email,
      direccion: dto.direccion,
      tipo: dto.tipo,
    });
  }

  listar(): Promise<SocioEntity[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: number): Promise<SocioEntity> {
    const socio = await this.repo.buscarPorId(id);
    if (!socio) {
      throw new NotFoundException(`No existe un socio con id ${id}`);
    }
    return socio;
  }

  async actualizar(id: number, dto: UpdateSocioDto): Promise<SocioEntity> {
    await this.buscarPorId(id);
    return this.repo.actualizar(id, dto);
  }

  async eliminar(id: number): Promise<void> {
    await this.buscarPorId(id);
    await this.repo.eliminar(id);
  }
}
