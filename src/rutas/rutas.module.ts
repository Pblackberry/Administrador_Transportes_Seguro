import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RutasService } from './rutas.service';
import { RutasController } from './rutas.controller';
import { Ruta, RutaSchema } from './schemas/ruta.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ruta.name, schema: RutaSchema }]),
  ],
  providers: [RutasService],
  controllers: [RutasController],
  exports: [RutasService], // lo vas a necesitar luego para el endpoint de KMS
})
export class RutasModule {}