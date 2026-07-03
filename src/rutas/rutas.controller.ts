import { Controller, Get, Post, Body, Render, Res } from '@nestjs/common';
import type { Response } from 'express';
import { RutasService } from './rutas.service';

@Controller('rutas')
export class RutasController {
  constructor(private readonly rutasService: RutasService) {}

  @Get()
  @Render('rutas')
  async index() {
    const rutas = await this.rutasService.listarTodas();
    return { rutas };
  }

  @Post()
  async crear(@Body() body: any, @Res() res: Response) {
    const paradas: any[] = [];
    const nombres = [].concat(body.paradaNombre || []);
    const callesPrincipales = [].concat(body.paradaCallePrincipal || []);
    const callesSecundarias = [].concat(body.paradaCalleSecundaria || []);
    const tiempos = [].concat(body.paradaTiempo || []);

    for (let i = 0; i < nombres.length; i++) {
      if (nombres[i]) {
        paradas.push({
          nombre: nombres[i],
          calle_principal: callesPrincipales[i],
          calle_secundaria: callesSecundarias[i],
          tiempo: Number(tiempos[i]),
        });
      }
    }

    await this.rutasService.crear(body.nombre, Number(body.frecuencia), paradas);
    return res.redirect('/rutas');
  }
}