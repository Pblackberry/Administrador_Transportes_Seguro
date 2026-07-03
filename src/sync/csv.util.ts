export function rutasACsv(rutas: any[]): string {
  const encabezados = [
    'id_ruta', 'nombre_ruta', 'frecuencia', 'orden_parada',
    'parada_nombre', 'parada_calle_principal', 'parada_calle_secundaria',
    'parada_tiempo', 'creado_en', 'actualizado_en',
  ];

  const filas: string[] = [encabezados.join(',')];

  for (const ruta of rutas) {
    const paradas = ruta.paradas || [];
    paradas.forEach((parada: any, index: number) => {
      const fila = [
        ruta._id?.toString() ?? '',
        ruta.nombre ?? '',
        ruta.frecuencia ?? '',
        index + 1,
        parada.nombre ?? '',
        parada.calle_principal ?? '',
        parada.calle_secundaria ?? '',
        parada.tiempo ?? '',
        ruta.createdAt ?? '',
        ruta.updatedAt ?? '',
      ].map((valor) => `"${String(valor).replace(/"/g, '""')}"`);

      filas.push(fila.join(','));
    });
  }

  return filas.join('\n');
}