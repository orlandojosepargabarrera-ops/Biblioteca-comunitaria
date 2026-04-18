import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { LibrosService } from './libros.service';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';
import { LibroMapper } from './mappers/libro.mapper';

/**
 * Capa Controller: recibe peticiones HTTP, delega al Service
 * y transforma la respuesta con el Mapper.
 * CU-01: Registrar libro
 */
@Controller('libros')
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  @Post()
  async crear(@Body() dto: CreateLibroDto) {
    const libro = await this.librosService.crear(dto);
    return LibroMapper.toHttp(libro);
  }

  @Get()
  async listar() {
    const libros = await this.librosService.listar();
    return libros.map(LibroMapper.toHttp);
  }

  @Get(':id')
  async buscarPorId(@Param('id', ParseIntPipe) id: number) {
    const libro = await this.librosService.buscarPorId(id);
    return LibroMapper.toHttp(libro);
  }

  @Patch(':id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLibroDto,
  ) {
    const libro = await this.librosService.actualizar(id, dto);
    return LibroMapper.toHttp(libro);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    await this.librosService.eliminar(id);
  }
}
