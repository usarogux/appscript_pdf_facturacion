function generarPdfDinamico(params) {
  const tipoDoc = params.tipo_tra;
  let nombrePlantilla = '';
  let detalleHtml = '';
  let cuotasHtml = '';

  // --- 1. SELECCIÓN DE PLANTILLA Y CONSTRUCCIÓN DE DETALLES ---
  switch (tipoDoc) {
    case "FE": // Factura Electrónica
      nombrePlantilla = 'plantilla_complejos/factura_compleja'; // Usa tu nueva plantilla
      detalleHtml = construirDetalleFactura(params.filas_detalle);
      cuotasHtml = construirCuotas(params.filas_cuotas);
      break;
    
    case "BE": // Boleta Electrónica
      // Cuando tengas la plantilla "boleta.html", la pones aquí
      nombrePlantilla = 'plantilla_complejos/Boleta_compleja'; // EJEMPLO
      detalleHtml = construirDetalleBoleta(params.filas_detalle); // Usará una función diferente
      cuotasHtml = construirCuotas(params.filas_cuotas);
      break;
      
    case "SAL": // Guía de Remisión
      // Cuando tengas la plantilla "guia.html", la pones aquí
      nombrePlantilla = 'plantilla_complejos/guia_remision'; // EJEMPLO
      detalleHtml = construirDetalleGuia(params.filas_detalle); // Su propia función de construcción
      // Las guías no suelen tener cuotas, así que no se llama a esa función
      break;

    case "CF": // Nota de Credito Electrónica
      // Cuando tengas la plantilla "boleta.html", la pones aquí
      nombrePlantilla = 'plantilla_complejos/nota_credito_complejo'; // EJEMPLO
      detalleHtml = construirDetalleNotaCredito(params.filas_detalle); // Usará una función diferente
      cuotasHtml = construirCuotas(params.filas_cuotas);
      break;

    // Puedes añadir más casos para NC (Nota de Crédito), etc.
    // case "NC":
    //   ...
    //   break;

    default:
      throw new Error(`Tipo de documento '${tipoDoc}' no reconocido.`);
  }

  // Asignamos el HTML generado al objeto de parámetros
  params.filas_detalle = detalleHtml;
  params.filas_cuotas = cuotasHtml;

  // --- 2. PROCESAMIENTO COMÚN (IMÁGENES, FORMATOS, ETC.) ---
  params.logo = obtenerImagenBase64DesdeDrivePorCarpeta(params.folder_empresa, params.logo);
  params.imagen_qr_respuesta = obtenerQRBase64(params.imagen_qr_respuesta);
  
  // Formateo de montos (puedes mover esto a una función si se repite mucho)
  params.total_venta = formatearMonto(params.total_venta || '0.00');
      params.subtotal_ventas = formatearMonto(params.subtotal_ventas || '0.00');
      params.anticipos = formatearMonto(params.anticipos || '0.00');
      params.descuentos = formatearMonto(params.descuentos || '0.00');
      params.valor_venta = formatearMonto(params.valor_venta || '0.00');
      params.isc = formatearMonto(params.isc || '0.00');
      params.igv = formatearMonto(params.igv || '0.00');
      params.icbper = formatearMonto(params.icbper || '0.00');
      params.otros_cargos = formatearMonto(params.otros_cargos || '0.00');
      params.otros_tributos = formatearMonto(params.otros_tributos || '0.00');

      params.op_gratuitas = formatearMonto(params.op_gratuitas || '0.00');
      params.op_exoneradas = formatearMonto(params.op_exoneradas || '0.00');
      params.op_inafectas = formatearMonto(params.op_inafectas || '0.00');
      params.monto_det = formatearMonto(params.monto_det || '0.00');
      
  // ... resto de formateos ...

  const montoParaLetras = (params.total_venta || '0').replace(/,/g, '');
  params.tot_letras_appscript = montoEnLetras(parseFloat(montoParaLetras), params.moneda_texto);

  // --- 3. GENERACIÓN DEL PDF ---
  const htmltemplate = HtmlService.createTemplateFromFile(nombrePlantilla);
  Object.keys(params).forEach(key => htmltemplate[key] = params[key]);
  const htmlContent = htmltemplate.evaluate().getContent();
  
  const pdfUrl = guardarDocumento(htmlContent, tipoDoc, params.transaccion_numero, params.folderId, params.numero_archivo);
  Logger.log(`PDF para ${tipoDoc} (${params.transaccion_numero}) generado: ${pdfUrl}`);
}