import { Module } from '@nestjs/common';
import { LibrosController } from './libros.controller';
import { LibrosService } from './libros.service';
import { LibrosRepository } from './libros.repository';

@Module({
  controllers: [LibrosController],
  providers: [LibrosService, LibrosRepository],
  exports: [LibrosService, LibrosRepository],
})
export class LibrosModule {}
