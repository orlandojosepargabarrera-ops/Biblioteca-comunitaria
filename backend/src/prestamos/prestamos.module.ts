import { Module } from '@nestjs/common';
import { PrestamosController } from './prestamos.controller';
import { PrestamosService } from './prestamos.service';
import { PrestamosRepository } from './prestamos.repository';
import { LibrosModule } from '../libros/libros.module';
import { SociosModule } from '../socios/socios.module';

@Module({
  imports: [LibrosModule, SociosModule],
  controllers: [PrestamosController],
  providers: [PrestamosService, PrestamosRepository],
})
export class PrestamosModule {}
