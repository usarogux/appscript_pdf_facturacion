/*function doPost(e) {
  try {
    // 1. Leemos los parámetros de la URL del bot
    const idFila = e.parameter.id_fila;
    const ambiente = e.parameter.ambiente; // Puedes añadir más parámetros si los necesitas

    if (!idFila) {
      throw new Error("No se proporcionó un id_fila en la URL.");
    }

    // 2. Leemos el JSON que el bot envió en el "Body"
    //    Este objeto contiene TODOS los datos para la plantilla (logo, totales, etc.)
    const datosParaPlantilla = JSON.parse(e.postData.contents);
    
    // 3. Llamamos a la función que genera el PDF, pasándole los datos del Body
    generarPdfComplejo(idFila, datosParaPlantilla);

    // 4. Devolvemos una respuesta de éxito al bot
    return ContentService.createTextOutput(JSON.stringify({ status: 'éxito', message: 'PDF en proceso de generación.' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log(`Error en doPost para la fila ${e.parameter.id_fila}: ${error.toString()}`);
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}


// =============================================================
// 🔹 FUNCIÓN TRABAJADORA: Usa los datos del Body (VERSIÓN MEJORADA)
// =============================================================
function generarPdfComplejo(idFila, paramsParaPlantilla) {
  
  // --- 1. PROCESAR DATOS DEL SERVIDOR (IMÁGENES) ---
  const qrCodeString = paramsParaPlantilla.imagen_qr_respuesta; // Corregido al nombre de tu campo
  
  // ▼▼▼ AÑADE ESTAS DOS LÍNEAS PARA DEPURAR ▼▼▼
  Logger.log("ID de Carpeta para Logo: " + paramsParaPlantilla.folder_empresa);
  Logger.log("Ruta/Nombre del Logo: " + paramsParaPlantilla.logo);
  
  paramsParaPlantilla.logo = obtenerImagenBase64DesdeDrivePorCarpeta(paramsParaPlantilla.folder_empresa, paramsParaPlantilla.logo);
  paramsParaPlantilla.imagen_qr_respuesta = obtenerQRBase64(qrCodeString); 
  
  
  // --- 2. CONSTRUIR EL HTML DE LOS DETALLES (LA CORRECCIÓN CLAVE) ---
  let detalleHtml = '';
  // Verificamos si 'filas_detalle' es una lista (array)
  if (paramsParaPlantilla.filas_detalle && Array.isArray(paramsParaPlantilla.filas_detalle)) {
    
    // Recorremos cada item de la lista y construimos una fila <tr>
    paramsParaPlantilla.filas_detalle.forEach(item => {
      detalleHtml += `
         <tr>
          <td style="text-align: center;">${item.num_linea || ''}</td>
          <td>${item.codigo || ''}</td>
          <td>${item.nombre || ''}</td>
          <td style="text-align: right;">${formatearMonto(item.cantidad || '0.00')}</td>
          <td style="text-align: center;">${item.unidad || ''}</td>
          <td style="text-align: right;">${formatearMonto(item.precio_venta || '0.00')}</td>
          <td style="text-align: right;">${formatearMonto(item.descuento || '0.00')}</td>
          <td style="text-align: right;">${formatearMonto(item.total_linea || '0.00')}</td>
        </tr>
      `;
    });
  }
  // Reemplazamos la lista de objetos por el bloque de texto HTML final
  paramsParaPlantilla.filas_detalle = detalleHtml;


  // --- 3. PROCESAR CUOTAS (MISMA LÓGICA) ---
  let cuotasHtml = '';
  if (paramsParaPlantilla.filas_cuotas && Array.isArray(paramsParaPlantilla.filas_cuotas)) {
    paramsParaPlantilla.filas_cuotas.forEach(cuota => {
      cuotasHtml += `
        <tr>
          <td>${cuota.numero_cuota || ''}</td>
          <td>${cuota.fecha_pago || ''}</td>
          <td style="text-align: right;">${formatearMonto(cuota.monto || '0.00')}</td>
        </tr>
      `;
    });
  }
  paramsParaPlantilla.filas_cuotas = cuotasHtml;


  // --- 4. FORMATEO FINAL Y CREACIÓN DEL PDF ---
      paramsParaPlantilla.total_venta = formatearMonto(paramsParaPlantilla.total_venta || '0.00');
      paramsParaPlantilla.subtotal_ventas = formatearMonto(paramsParaPlantilla.subtotal_ventas || '0.00');
      paramsParaPlantilla.anticipos = formatearMonto(paramsParaPlantilla.anticipos || '0.00');
      paramsParaPlantilla.descuentos = formatearMonto(paramsParaPlantilla.descuentos || '0.00');
      paramsParaPlantilla.valor_venta = formatearMonto(paramsParaPlantilla.valor_venta || '0.00');
      paramsParaPlantilla.isc = formatearMonto(paramsParaPlantilla.isc || '0.00');
      paramsParaPlantilla.igv = formatearMonto(paramsParaPlantilla.igv || '0.00');
      paramsParaPlantilla.icbper = formatearMonto(paramsParaPlantilla.icbper || '0.00');
      paramsParaPlantilla.otros_cargos = formatearMonto(paramsParaPlantilla.otros_cargos || '0.00');
      paramsParaPlantilla.otros_tributos = formatearMonto(paramsParaPlantilla.otros_tributos || '0.00');

      paramsParaPlantilla.op_gratuitas = formatearMonto(paramsParaPlantilla.op_gratuitas || '0.00');
      paramsParaPlantilla.op_exoneradas = formatearMonto(paramsParaPlantilla.op_exoneradas || '0.00');
      paramsParaPlantilla.op_inafectas = formatearMonto(paramsParaPlantilla.op_inafectas || '0.00');
      paramsParaPlantilla.monto_det = formatearMonto(paramsParaPlantilla.monto_det || '0.00');
      

  const montoParaLetras = (paramsParaPlantilla.total_venta || '0').replace(/,/g, '');
  paramsParaPlantilla.tot_letras_appscript = montoEnLetras(parseFloat(montoParaLetras), paramsParaPlantilla.moneda_texto);
  
  const htmltemplate = HtmlService.createTemplateFromFile('plantilla_complejos/factura_compleja');
  Object.keys(paramsParaPlantilla).forEach(key => htmltemplate[key] = paramsParaPlantilla[key]);
  const htmlContent = htmltemplate.evaluate().getContent();
  
  const pdfUrl = guardarDocumento(htmlContent, paramsParaPlantilla.transaccion, paramsParaPlantilla.transaccion_numero, paramsParaPlantilla.folderId, paramsParaPlantilla.numero_archivo);
  Logger.log(`PDF Complejo generado para la fila ${idFila}: ${pdfUrl}`);
}*/

/*function doPost(e) {
  try {
    const idFila = e.parameter.id_fila;
    
    if (!idFila) {
      throw new Error("Faltan parámetros esenciales como 'id_fila' o 'tipo_tra' en el JSON.");
    }
    const datosParaPlantilla = JSON.parse(e.postData.contents);
    // Llamamos a la función orquestadora principal
    generarPdfDinamico(datosParaPlantilla);

    return ContentService.createTextOutput(JSON.stringify({ status: 'éxito', message: 'PDF en proceso de generación.' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log(`Error en doPost: ${error.toString()}`);
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}*/
function doPost(e) {
  try {
    const datosParaPlantilla = JSON.parse(e.postData.contents);
    // Llamamos a la función orquestadora principal
    generarPdfDinamico(datosParaPlantilla);

    return ContentService.createTextOutput(JSON.stringify({ 
        status: 'éxito', 
        message: 'PDF en proceso de generación.' 
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log(`Error en doPost: ${error.toString()}`);
    return ContentService.createTextOutput(JSON.stringify({ 
        status: 'error', 
        message: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}



