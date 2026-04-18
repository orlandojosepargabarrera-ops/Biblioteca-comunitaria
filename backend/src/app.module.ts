import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { LibrosModule } from './libros/libros.module';
import { SociosModule } from './socios/socios.module';
import { PrestamosModule } from './prestamos/prestamos.module';

@Module({
  imports: [PrismaModule, LibrosModule, SociosModule, PrestamosModule],
})
export class AppModule {}
