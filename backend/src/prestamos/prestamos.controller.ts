import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PrestamosService } from './prestamos.service';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { DevolverPrestamoDto } from './dto/devolver-prestamo.dto';
import { PrestamoMapper } from './mappers/prestamo.mapper';

/**
 * CU-03: Realizar préstamo
 * CU-04: Registrar devolución
 * CU-05: Consultar préstamos vencidos y socios con pendientes
 */
@Controller('prestamos')
export class PrestamosController {
  constructor(private readonly prestamosService: PrestamosService) {}

  @Post()
  async crear(@Body() dto: CreatePrestamoDto) {
    const p = await this.prestamosService.realizarPrestamo(dto);
    return PrestamoMapper.toHttp(p);
  }

  @Patch(':id/devolver')
  async devolver(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: DevolverPrestamoDto,
  ) {
    const p = await this.prestamosService.registrarDevolucion(id, dto);
    return PrestamoMapper.toHttp(p);
  }

  @Get()
  async listar() {
    const prestamos = await this.prestamosService.listar();
    return prestamos.map(PrestamoMapper.toHttp);
  }

  @Get('vencidos')
  async vencidos() {
    const prestamos = await this.prestamosService.listarVencidos();
    return prestamos.map(PrestamoMapper.toHttp);
  }

  @Get('pendientes-por-socio')
  async pendientesPorSocio() {
    return this.prestamosService.listarSociosConPendientes();
  }

  @Get(':id')
  async buscarPorId(@Param('id', ParseIntPipe) id: number) {
    const p = await this.prestamosService.buscarPorId(id);
    return PrestamoMapper.toHttp(p);
  }
}
