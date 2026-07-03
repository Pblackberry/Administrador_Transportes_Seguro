import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class KmsService {
  private readonly logger = new Logger(KmsService.name);
  private readonly vaultAddr = process.env.VAULT_ADDR || 'http://localhost:8200';
  private readonly vaultToken = process.env.VAULT_TOKEN || 'root';
  private readonly transitKey = process.env.VAULT_TRANSIT_KEY || 'kms-transporte';

  async encriptarPayload(datos: any): Promise<string> {
    try {
      const textoPlano = JSON.stringify(datos);
      const plaintextBase64 = Buffer.from(textoPlano).toString('base64');

      const respuesta = await axios.post(
        `${this.vaultAddr}/v1/transit/encrypt/${this.transitKey}`,
        { plaintext: plaintextBase64 },
        { headers: { 'X-Vault-Token': this.vaultToken } },
      );

      const tramaEncriptada: string = respuesta.data.data.ciphertext;
      this.logger.log('Respuesta encriptada exitosamente con Vault (transit).');
      return tramaEncriptada;

    } catch (error: any) {
      this.logger.error('Error al encriptar con Vault', error?.message || error);
      throw new InternalServerErrorException('Error procesando la seguridad de la respuesta');
    }
  }

  async desencriptarPayload(tramaEncriptada: string): Promise<any> {
    try {
      const respuesta = await axios.post(
        `${this.vaultAddr}/v1/transit/decrypt/${this.transitKey}`,
        { ciphertext: tramaEncriptada },
        { headers: { 'X-Vault-Token': this.vaultToken } },
      );

      const plaintextBase64: string = respuesta.data.data.plaintext;
      const textoPlano = Buffer.from(plaintextBase64, 'base64').toString('utf-8');
      return JSON.parse(textoPlano);

    } catch (error: any) {
      this.logger.error('Error al desencriptar con Vault', error?.message || error);
      throw new InternalServerErrorException('Error procesando la trama recibida de Sistema A');
    }
  }
}