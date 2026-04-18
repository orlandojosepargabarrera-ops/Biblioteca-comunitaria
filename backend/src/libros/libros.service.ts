import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LibrosRepository } from './libros.repository';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';
import { LibroEntity } from './entities/libro.entity';

/**
 * Capa Service: contiene la lógica de negocio.
 * No conoce Prisma directamente; delega el acceso a datos al Repository.
 */
@Injectable()
export class LibrosService {
  constructor(private readonly repo: LibrosRepository) {}

  async crear(dto: CreateLibroDto): Promise<LibroEntity> {
    const existente = await this.repo.buscarPorIsbn(dto.isbn);
    if (existente) {
      throw new ConflictException(
        `Ya existe un libro registrado con el ISBN ${dto.isbn}`,
      );
    }

    return this.repo.crear({
      titulo: dto.titulo,
      autor: dto.autor,
      genero: dto.genero,
      isbn: dto.isbn,
      totalEjemplares: dto.totalEjemplares,
      disponibles: dto.totalEjemplares,
    });
  }

  listar(): Promise<LibroEntity[]> {
    return this.repo.listar();
  }

  async buscarPorId(id: number): Promise<LibroEntity> {
    const libro = await this.repo.buscarPorId(id);
    if (!libro) {
      throw new NotFoundException(`No existe un libro con id ${id}`);
    }
    return libro;
  }

  async actualizar(id: number, dto: UpdateLibroDto): Promise<LibroEntity> {
    const actual = await this.buscarPorId(id);

    // Si se cambia el total de ejemplares, ajustamos 'disponibles' conservando prestados
    let disponibles = actual.disponibles;
    if (dto.totalEjemplares !== undefined) {
      const prestados = actual.totalEjemplares - actual.disponibles;
      disponibles = Math.max(dto.totalEjemplares - prestados, 0);
    }

    return this.repo.actualizar(id, {
      ...dto,
      ...(dto.totalEjemplares !== undefined && { disponibles }),
    });
  }

  async eliminar(id: number): Promise<void> {
    await this.buscarPorId(id);
    await this.repo.eliminar(id);
  }
}
