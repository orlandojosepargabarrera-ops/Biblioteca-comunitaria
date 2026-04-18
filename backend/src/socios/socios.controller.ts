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
import { SociosService } from './socios.service';
import { CreateSocioDto } from './dto/create-socio.dto';
import { UpdateSocioDto } from './dto/update-socio.dto';
import { SocioMapper } from './mappers/socio.mapper';

/** CU-02: Registrar socio */
@Controller('socios')
export class SociosController {
  constructor(private readonly sociosService: SociosService) {}

  @Post()
  async crear(@Body() dto: CreateSocioDto) {
    const socio = await this.sociosService.crear(dto);
    return SocioMapper.toHttp(socio);
  }

  @Get()
  async listar() {
    const socios = await this.sociosService.listar();
    return socios.map(SocioMapper.toHttp);
  }

  @Get(':id')
  async buscarPorId(@Param('id', ParseIntPipe) id: number) {
    const socio = await this.sociosService.buscarPorId(id);
    return SocioMapper.toHttp(socio);
  }

  @Patch(':id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSocioDto,
  ) {
    const socio = await this.sociosService.actualizar(id, dto);
    return SocioMapper.toHttp(socio);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    await this.sociosService.eliminar(id);
  }
}
