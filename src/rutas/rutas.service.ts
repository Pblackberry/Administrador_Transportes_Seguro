import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ruta, RutaDocument } from './schemas/ruta.schema';

@Injectable()
export class RutasService {
  constructor(
    @InjectModel(Ruta.name) private rutaModel: Model<RutaDocument>,
  ) {}

  async crear(nombre: string, frecuencia: number, paradas: any[]): Promise<Ruta> {
    const nueva = new this.rutaModel({ nombre, frecuencia, paradas });
    return nueva.save();
  }

  async listarTodas(): Promise<Ruta[]> {
    return this.rutaModel.find().exec();
  }

  async listarPorUsuario(userId: string): Promise<Ruta[]> {
    return this.rutaModel.find({ userId }).exec();
  }
}