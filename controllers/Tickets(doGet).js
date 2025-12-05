/**
 * Sirve la página principal. Pasa el ID, TIPO, AMBIENTE y ACCION a la página HTML.
 */
function doGet(e) {
  var template = HtmlService.createTemplateFromFile('PaginaPrincipal');
  template.idFila = e.parameter.id_fila;
  template.tipoDoc = e.parameter.tipo;
  template.ambiente = e.parameter.ambiente;
  template.accion = e.parameter.accion;
  template.formato = e.parameter.formato;
  template.idHoja = e.parameter.id_hoja;
  return template.evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// MODIFICADO: La función ahora acepta 'formato' y tiene la lógica de selección.
function procesarFacturaDesdeHoja(idFila, ambiente, accion, formato, idHoja) {
  // Si 'formato' no llega, le asignamos 'ticket' por defecto para no romper las URLs antiguas.
  formato = formato || 'ticket'; 
  Logger.log(`Iniciando Proceso de Factura. Acción: ${accion}, Formato: ${formato}`);

  const sheet = getSpreadsheet(idHoja).getSheetByName(HOJA_DATOS_FACTURA);
  let numeroDeFila = -1;
  try {
    const data = sheet.getDataRange().getValues();
    let filaEncontrada = null;
    for (let i = 1; i < data.length; i++) { if (data[i][COL_ID_FACTURA - 1] == idFila) { filaEncontrada = data[i]; numeroDeFila = i + 1; break; } }
    if (!filaEncontrada) { throw new Error(`No se encontró fila con ID: ${idFila} en ${HOJA_DATOS_FACTURA}`); }
    
    let datosRespuesta = {};
    const datosImpresionString = filaEncontrada[COL_IMPRESION_FACTURA - 1];

    if (accion === "enviar_imprimir") {
      // (Esta sección no cambia, la lógica de la API es la misma)
      let jsonPayload = filaEncontrada[COL_JSON_FACTURA - 1];
      if (!jsonPayload || !datosImpresionString) { return { status: 'RETRY' }; }
      if (jsonPayload && typeof jsonPayload === 'string') { jsonPayload = jsonPayload.replace(/:\s*"(\s*[,\}])/g, ':""$1'); }
      let urlApiFactura = (ambiente === 'PRUEBA') ? 'https://demo.mifact.net.pe/api/invoiceService.svc/SendInvoice' : 'https://mifact.net.pe/mifactapi44/invoiceService.svc/SendInvoice';
      const respuestaApi = UrlFetchApp.fetch(urlApiFactura, { 'method': 'post', 'contentType': 'application/json; charset=utf-8', 'payload': jsonPayload, 'muteHttpExceptions': true });
      const cuerpoRespuesta = respuestaApi.getContentText();
      datosRespuesta = JSON.parse(cuerpoRespuesta);
      if (datosRespuesta.errors && datosRespuesta.errors.trim() !== "") { throw new Error(datosRespuesta.errors); }
      sheet.getRange(numeroDeFila, COL_ESTADO_FACTURA).setValue(datosRespuesta.estado_documento);
      sheet.getRange(numeroDeFila, COL_MENSAJE_FACTURA).setValue(datosRespuesta.sunat_description);
      sheet.getRange(numeroDeFila, COL_HASH_FACTURA).setValue(datosRespuesta.cadena_para_codigo_qr);
      sheet.getRange(numeroDeFila, COL_ERROR_FACTURA).clearContent();
    } else {
      datosRespuesta.sunat_description = filaEncontrada[COL_MENSAJE_FACTURA - 1];
      datosRespuesta.cadena_para_codigo_qr = filaEncontrada[COL_HASH_FACTURA - 1];
    }

    var paramsParaPlantilla = parseQueryString(datosImpresionString);
    
    // =============================================================
    // ▼▼▼ NUEVO: LÓGICA DE SELECCIÓN DE FORMATO ▼▼▼
    // =============================================================
    if (formato === 'complejo') {
      // --- PROCESO PARA PDF COMPLEJO ---
      paramsParaPlantilla.logo = obtenerImagenBase64DesdeDrivePorCarpeta(paramsParaPlantilla.folder_empresa, paramsParaPlantilla.logo);
      paramsParaPlantilla.imagen_qr_respuesta = obtenerQRBase64(datosRespuesta.cadena_para_codigo_qr);
      
      // Usamos las nuevas funciones para procesar los datos para la plantilla compleja
      paramsParaPlantilla.filas_detalle = procesarFilasFacturaCompleja(paramsParaPlantilla.filas_detalle);
      paramsParaPlantilla.filas_cuotas = procesarFilasCuotas(paramsParaPlantilla.filas_cuotas);

      // Formateo de montos (necesario para la plantilla compleja)
      paramsParaPlantilla.subtotal_ventas = formatearMonto(paramsParaPlantilla.subtotal_ventas || '0.00');
      paramsParaPlantilla.anticipos = formatearMonto(paramsParaPlantilla.anticipos || '0.00');
      paramsParaPlantilla.descuentos = formatearMonto(paramsParaPlantilla.descuentos || '0.00');
      paramsParaPlantilla.valor_venta = formatearMonto(paramsParaPlantilla.valor_venta || '0.00');
      paramsParaPlantilla.isc = formatearMonto(paramsParaPlantilla.isc || '0.00');
      paramsParaPlantilla.igv = formatearMonto(paramsParaPlantilla.igv || '0.00');
      paramsParaPlantilla.icbper = formatearMonto(paramsParaPlantilla.icbper || '0.00');
      paramsParaPlantilla.otros_cargos = formatearMonto(paramsParaPlantilla.otros_cargos || '0.00');
      paramsParaPlantilla.otros_tributos = formatearMonto(paramsParaPlantilla.otros_tributos || '0.00');
      paramsParaPlantilla.total_venta = formatearMonto(paramsParaPlantilla.total_venta || '0.00');
      
      const montoParaLetras = (paramsParaPlantilla.total_venta || '0').replace(/,/g, '');
      paramsParaPlantilla.tot_letras_appscript = montoEnLetras(parseFloat(montoParaLetras), paramsParaPlantilla.moneda_texto);

      var htmltemplate = HtmlService.createTemplateFromFile('plantilla_complejos/factura_compleja');
      Object.keys(paramsParaPlantilla).forEach(key => htmltemplate[key] = paramsParaPlantilla[key]);
      var htmlContent = htmltemplate.evaluate().getContent();
      
      const pdfUrl = guardarDocumento(htmlContent, paramsParaPlantilla.transaccion, paramsParaPlantilla.transaccion_numero, paramsParaPlantilla.folderId, paramsParaPlantilla.numero_archivo);
      
      // Devolvemos la URL del PDF
      return { status: 'Éxito', sunat_description: datosRespuesta.sunat_description || "PDF Complejo Generado", pdfUrl: pdfUrl };

    } else {
      // --- PROCESO PARA TICKET SIMPLE (EL CÓDIGO ORIGINAL) ---
      paramsParaPlantilla.filas_detalle = procesarFilasGenerico(paramsParaPlantilla.filas_detalle || '-', paramsParaPlantilla.transaccion);
      paramsParaPlantilla.imagen_qr_respuesta = obtenerQRUrl(datosRespuesta.cadena_para_codigo_qr || '');

      // 🔹 FORMATEO DE MONTOS PARA TICKETS
      paramsParaPlantilla.total_venta = formatearMonto(paramsParaPlantilla.total_venta || '0.00');
      paramsParaPlantilla.subtotal_ventas = formatearMonto(paramsParaPlantilla.subtotal_ventas || '0.00');
      paramsParaPlantilla.igv = formatearMonto(paramsParaPlantilla.igv || '0.00');
      paramsParaPlantilla.op_gratuitas = formatearMonto(paramsParaPlantilla.op_gratuitas || '0.00');
      paramsParaPlantilla.op_exoneradas = formatearMonto(paramsParaPlantilla.op_exoneradas || '0.00');
      paramsParaPlantilla.op_inafectas = formatearMonto(paramsParaPlantilla.op_inafectas || '0.00');
      
      const montoParaLetras = (paramsParaPlantilla.total_venta || '0').replace(/,/g, '');
      paramsParaPlantilla.tot_letras_appscript = montoEnLetras(parseFloat(montoParaLetras), paramsParaPlantilla.moneda_texto);

      var htmltemplate;
      switch (paramsParaPlantilla.transaccion) {
        case "FE": htmltemplate = HtmlService.createTemplateFromFile('plantilla_tickets/factura'); break;
        case "BE": htmltemplate = HtmlService.createTemplateFromFile('plantilla_tickets/boleta'); break;
        case "CF": htmltemplate = HtmlService.createTemplateFromFile('plantilla_tickets/nota_credito'); break;
        case "CB": htmltemplate = HtmlService.createTemplateFromFile('plantilla_tickets/nota_credito'); break;
        case "CO": htmltemplate = HtmlService.createTemplateFromFile('plantilla_tickets/cotizacion'); break;
        default: throw new Error("Tipo de transacción no válido: " + paramsParaPlantilla.transaccion);
      }

      Object.keys(paramsParaPlantilla).forEach(key => htmltemplate[key] = paramsParaPlantilla[key]);
      const htmlFinal = htmltemplate.evaluate().getContent();
      
      // Devolvemos el HTML del comprobante
      return { status: 'Éxito', sunat_description: datosRespuesta.sunat_description, htmlComprobante: htmlFinal };
    }
  } catch (error) {
    Logger.log(`❌ Error en Factura ${idFila}: ${error.message}\nStack: ${error.stack}`);
    if (numeroDeFila !== -1) { 
      sheet.getRange(numeroDeFila, COL_ESTADO_FACTURA).setValue("Error");
      sheet.getRange(numeroDeFila, COL_ERROR_FACTURA).setValue(error.message.substring(0, 50000));
    }
    return { status: 'Error', message: error.message };
  }
}