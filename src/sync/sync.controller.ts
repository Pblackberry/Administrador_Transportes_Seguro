import { Controller, Post, Body, Logger } from '@nestjs/common';
import { KmsService } from '../kms/kms.service';
import { RutasService } from '../rutas/rutas.service';
import { rutasACsv } from './csv.util';

@Controller('sync')
export class SyncController {
  private readonly logger = new Logger(SyncController.name);

  constructor(
    private readonly kmsService: KmsService,
    private readonly rutasService: RutasService,
  ) {}

  @Post()
  async recibirPeticion(@Body('payloadEncriptado') payloadEncriptado: string) {
    const peticion = await this.kmsService.desencriptarPayload(payloadEncriptado);
    this.logger.log(`Petición recibida de Sistema A: ${JSON.stringify(peticion)}`);

    const rutas = await this.rutasService.listarTodas();
    const csv = rutasACsv(rutas);

    const respuestaCifrada = await this.kmsService.encriptarPayload({ csv });

    return { payloadEncriptado: respuestaCifrada };
  }
}