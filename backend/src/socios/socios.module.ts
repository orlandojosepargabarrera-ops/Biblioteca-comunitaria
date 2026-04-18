import { Module } from '@nestjs/common';
import { SociosController } from './socios.controller';
import { SociosService } from './socios.service';
import { SociosRepository } from './socios.repository';

@Module({
  controllers: [SociosController],
  providers: [SociosService, SociosRepository],
  exports: [SociosService, SociosRepository],
})
export class SociosModule {}
