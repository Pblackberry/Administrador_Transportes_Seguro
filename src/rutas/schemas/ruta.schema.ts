import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RutaDocument = Ruta & Document;

class Parada {
  @Prop({ required: true })
  nombre!: string;

  @Prop({ required: true })
  calle_principal!: string;

  @Prop({ required: true })
  calle_secundaria!: string;

  @Prop({ required: true })
  tiempo!: number;
}

@Schema({ timestamps: true })
export class Ruta {
  @Prop({ required: true })
  nombre!: string;

  @Prop([
    {
      nombre: { type: String, required: true },
      calle_principal: { type: String, required: true },
      calle_secundaria: { type: String, required: true },
      tiempo: { type: Number, required: true },
    },
  ])
  paradas!: Parada[];

  @Prop({ required: true })
  frecuencia!: number;
}

export const RutaSchema = SchemaFactory.createForClass(Ruta);