
// =============================================================
// 🔹 PROCESO PARA GUÍAS DE REMISIÓN
// =============================================================
function procesarGuiaDesdeHoja(idFila, ambiente, accion) {
  Logger.log("Iniciando Proceso de Guía. Ambiente recibida: " + ambiente);
   Logger.log("Iniciando Proceso de Guía. Acción recibida: " + accion);
  const sheet = getSpreadsheet().getSheetByName(HOJA_DATOS_GUIA);
  let numeroDeFila = -1;
  try {
    const data = sheet.getDataRange().getValues();
    let filaEncontrada = null;
    for (let i = 1; i < data.length; i++) { if (data[i][COL_ID_GUIA - 1] == idFila) { filaEncontrada = data[i]; numeroDeFila = i + 1; break; } }
    if (!filaEncontrada) { throw new Error(`No se encontró fila con ID: ${idFila} en ${HOJA_DATOS_GUIA}`); }

    let datosRespuesta = {};
    const datosImpresionString = filaEncontrada[COL_IMPRESION_GUIA - 1];

    if (accion === "enviar_imprimir") {
        let jsonPayload = filaEncontrada[COL_JSON_GUIA - 1];
        if (!jsonPayload || !datosImpresionString) { return { status: 'RETRY' }; }
        if (jsonPayload && typeof jsonPayload === 'string') { jsonPayload = jsonPayload.replace(/:\s*"(\s*[,\}])/g, ':""$1'); }

        let urlApiGuia;
        if (ambiente === 'PRUEBA') { urlApiGuia = 'https://demo.mifact.net.pe/api/GuiaRemision.svc/SendGuia'; }
        else { urlApiGuia = 'https://demo.mifact.net.pe/api/GuiaRemision.svc/SendGuia'; }
        
        const respuestaApi = UrlFetchApp.fetch(urlApiGuia, { 'method': 'post', 'contentType': 'application/json; charset=utf-8', 'payload': jsonPayload, 'muteHttpExceptions': true });
        const cuerpoRespuesta = respuestaApi.getContentText();
        datosRespuesta = JSON.parse(cuerpoRespuesta);
        
        if (datosRespuesta.errors && datosRespuesta.errors.trim() !== "") { throw new Error(datosRespuesta.errors); }
    } else {
        datosRespuesta.cadena_para_codigo_qr = filaEncontrada[COL_HASH_GUIA - 1];
        datosRespuesta.sunat_description = "Reimpresión de Guía de Remisión.";
    }

    let mensajeFinal = datosRespuesta.sunat_description;
    if (!mensajeFinal || mensajeFinal.trim() === '') {
        switch(datosRespuesta.estado_documento) {
            case '101': mensajeFinal = 'La Guía está en proceso de envío a SUNAT.'; break;
            case '102': mensajeFinal = `La Guía número ${datosRespuesta.serie_cpe}-${datosRespuesta.correlativo_cpe}, ha sido aceptada.`; break;
            case '103': mensajeFinal = `La Guía número ${datosRespuesta.serie_cpe}-${datosRespuesta.correlativo_cpe}, ha sido aceptada con observaciones.`; break;
            default: mensajeFinal = 'Guía procesada y PDF generado en Drive.';
        }
    }
    
    if (accion === "enviar_imprimir") {
        sheet.getRange(numeroDeFila, COL_ESTADO_GUIA).setValue(datosRespuesta.estado_documento || "PDF GENERADO");
        sheet.getRange(numeroDeFila, COL_MENSAJE_GUIA).setValue(mensajeFinal);
        sheet.getRange(numeroDeFila, COL_HASH_GUIA).setValue(datosRespuesta.cadena_para_codigo_qr);
        sheet.getRange(numeroDeFila, COL_ERROR_GUIA).clearContent();
    }

    var paramsParaPlantilla = parseQueryString(datosImpresionString);
    //paramsParaPlantilla.logo = "";
    paramsParaPlantilla.logo = obtenerImagenBase64DesdeDrivePorCarpeta(paramsParaPlantilla.folder_empresa, paramsParaPlantilla.logo);
    paramsParaPlantilla.imagen_qr_respuesta = obtenerQRBase64(datosRespuesta.cadena_para_codigo_qr);
    paramsParaPlantilla.filas_detalle = procesarFilasGuia(paramsParaPlantilla.filas_detalle);

    var htmltemplate = HtmlService.createTemplateFromFile('plantilla_complejos/guia_remision');
    Object.keys(paramsParaPlantilla).forEach(key => htmltemplate[key] = paramsParaPlantilla[key]);
    var htmlContent = htmltemplate.evaluate().getContent();
    
    const pdfUrl = guardarDocumento(htmlContent, "GR", paramsParaPlantilla.transaccion_numero, paramsParaPlantilla.folderId, paramsParaPlantilla.numero_archivo);
    
    return { status: 'Éxito', sunat_description: mensajeFinal, pdfUrl: pdfUrl };
  } catch (error) {
    Logger.log(`❌ Error en Guía ${idFila}: ${error.message}`);
    if (numeroDeFila !== -1) { 
      sheet.getRange(numeroDeFila, COL_ESTADO_GUIA).setValue("Error");
      sheet.getRange(numeroDeFila, COL_ERROR_GUIA).setValue(error.message.substring(0, 50000));
    }
    return { status: 'Error', message: error.message };
  }
}

function procesarCotizacionDesdeHoja(idFila) {
  try {
    const sheet = getSpreadsheet().getSheetByName(HOJA_DATOS_COTIZACION);
    const data = sheet.getDataRange().getValues();
    
    let filaEncontrada = null;
    for (let i = 1; i < data.length; i++) {
      if (data[i][COL_ID_COTIZACION - 1] == idFila) {
        filaEncontrada = data[i];
        break;
      }
    }
    if (!filaEncontrada) { throw new Error(`No se encontró fila con ID: ${idFila} en ${HOJA_DATOS_COTIZACION}`); }

    const datosImpresionString = filaEncontrada[COL_IMPRESION_COTIZACION - 1];

    if (!datosImpresionString) { return { status: 'RETRY' }; }

    var paramsParaPlantilla = parseQueryString(datosImpresionString);
    paramsParaPlantilla.filas_detalle = procesarFilasGenerico(paramsParaPlantilla.filas_detalle || '-', paramsParaPlantilla.transaccion);
    
    const montoParaLetras = (paramsParaPlantilla.total_venta || '0').replace(/,/g, '');
    paramsParaPlantilla.tot_letras_appscript = montoEnLetras(parseFloat(montoParaLetras), paramsParaPlantilla.moneda_texto);

    var htmltemplate = HtmlService.createTemplateFromFile('plantilla_tickets/cotizacion');
    Object.keys(paramsParaPlantilla).forEach(key => htmltemplate[key] = paramsParaPlantilla[key]);
    const htmlFinal = htmltemplate.evaluate().getContent();
    
    return { status: 'Éxito', sunat_description: 'Cotización ' + paramsParaPlantilla.transaccion_numero + ' generada.', htmlComprobante: htmlFinal };

  } catch (error) {
    Logger.log(`❌ Error en Cotización ${idFila}: ${error.message}`);
    return { status: 'Error', message: error.message };
  }
}


/**
 * =============================================================
 * 🔹 FUNCIÓN DE PRUEBA (VERSIÓN CORREGIDA) 🔹
 * =============================================================
 * Esta función llama DIRECTAMENTE a la lógica de procesamiento para una simulación real.
 */
function testProcesarDirectamenteFactura() {
  
  // --- PASO 1: CONFIGURA TUS PARÁMETROS DE PRUEBA AQUÍ ---
  
  const idFilaDePrueba = "f53f6316"; // Usa el ID real de una fila que quieras probar.
  const ambienteDePrueba = "PRUEBA";
  const accionAEjecutar = "solo_imprimir"; // o "enviar_imprimir"
  const formatoDeSalida = "complejo";   // o "ticket"

  // --- PASO 2: LLAMAMOS DIRECTAMENTE A LA FUNCIÓN QUE HACE EL TRABAJO ---
  Logger.log(`🚀 INICIANDO PRUEBA DIRECTA para la fila: ${idFilaDePrueba}`);
  
  try {
    // ANTES: llamábamos a doGet(eventoSimulado)
    // AHORA: llamamos directamente a la función que procesa la factura
    procesarFacturaDesdeHoja(idFilaDePrueba, ambienteDePrueba, accionAEjecutar, formatoDeSalida);
    
    Logger.log("✅ PRUEBA FINALIZADA. Revisa los logs para ver el detalle.");

  } catch (error) {
    Logger.log(`❌ PRUEBA FALLIDA: ${error.message}`);
  }
  
  Logger.log("----------------------------------------------------");
}



