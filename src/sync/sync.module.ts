import { Module } from '@nestjs/common';
import { SyncController } from './sync.controller';
import { KmsService } from '../kms/kms.service';
import { RutasModule } from '../rutas/rutas.module';

@Module({
  imports: [RutasModule],
  controllers: [SyncController],
  providers: [KmsService],
})
export class SyncModule {}