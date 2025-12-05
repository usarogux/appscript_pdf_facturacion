/**
 * Construye las filas <tr> para la tabla de detalles de una FACTURA.
 */
/**
 * Construye las filas <tr> para la tabla de detalles de una FACTURA.
 * VERSIÓN ACTUALIZADA: Incluye los detalles adicionales debajo del nombre.
 */
function construirDetalleFactura(filas) {
  if (!filas || !Array.isArray(filas)) return '';
  let html = '';
  filas.forEach(item => {

    // --- LÓGICA PARA LOS DETALLES ADICIONALES ---
    let detalleAdicionalHtml = '';
    // 1. Verificamos si el campo 'detalle01' existe y no está vacío.
    if (item.detalle01 && item.detalle01.trim() !== '') {
      // 2. Reemplazamos los saltos de línea de texto (\n) por saltos de línea HTML (<br>).
      const detalleFormateado = item.detalle01.replace(/\n/g, '<br>');
      // 3. Lo envolvemos en una etiqueta <small> para que se vea más pequeño y con otro color.
      detalleAdicionalHtml = `<br><small style="color: #000; line-height: 1.1;">${detalleFormateado}</small>`;
    }
    // --- FIN DE LA LÓGICA ---

    html += `
      <tr>
        <td style="text-align: center;">${item.codigo || ''}</td>
        <td>${item.nombre || ''}${detalleAdicionalHtml}</td>
        <td style="text-align: center;">${formatearMonto(item.cantidad || '0.00')}</td>
        <td style="text-align: center;">${item.unidad || ''}</td>
        <td style="text-align: right;">${formatearMonto(item.valor_unitario || '0.00')}</td>
        <td style="text-align: right;">${formatearMonto(item.descuento || '0.00')}</td>
        <td style="text-align: right;">${formatearMonto(item.precio_venta || '0.00')}</td>
        <td style="text-align: right;">${formatearMonto(item.valor_venta_total || '0.00')}</td>
        <td style="text-align: right;">${formatearMonto(item.igv_item || '0.00')}</td>
        <td style="text-align: right;">${formatearMonto(item.total_linea || '0.00')}</td>
      </tr>
    `;
  });
  return html;
}

/**
 * Construye las filas <tr> para la tabla de detalles de una BOLETA.
 * NOTA: Puede ser igual a la de la factura, o tener menos columnas.
 */
function construirDetalleBoleta(filas) {
  if (!filas || !Array.isArray(filas)) return '';
  let html = '';
  filas.forEach(item => {
    html += `
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
  return html;
}

/**
 * Construye las filas <tr> para la tabla de detalles de una GUÍA DE REMISIÓN.
 * NOTA: Las columnas son diferentes.
 */
function construirDetalleGuia(filas) {
  if (!filas || !Array.isArray(filas)) return '';
  let html = '';
  filas.forEach(item => {

    // --- LÓGICA PARA LOS DETALLES ADICIONALES (Exactamente igual que en la factura) ---
    let detalleAdicionalHtml = '';
    // 1. Verificamos si el campo 'detalle01' existe y no está vacío.
    if (item.detalle01 && item.detalle01.trim() !== '') {
      // 2. Reemplazamos los saltos de línea de texto (\n) por saltos de línea HTML (<br>).
      const detalleFormateado = item.detalle01.replace(/\n/g, '<br>');
      // 3. Lo envolvemos en una etiqueta <small> para que se vea más pequeño.
      detalleAdicionalHtml = `<br><small style="color: #000; line-height: 1.1;">${detalleFormateado}</small>`;
    }
    // --- FIN DE LA LÓGICA ---

    // Construimos la fila <tr> con las 5 columnas de la Guía de Remisión
    html += `
      <tr>
        <td style="text-align: center;">${item.num_linea || ''}</td>
        <td>${item.codigo || ''}</td>
        
        <td>${item.nombre || ''}${detalleAdicionalHtml}</td>
        
        <td style="text-align: center;">${item.cantidad || ''}</td>
        <td style="text-align: center;">${item.unidad_med || ''}</td>
      </tr>
    `;
  });
  return html;
}

/**
 * Construye las filas <tr> para la tabla de detalles de una NOTA DE CRÉDITO.
 * VERSIÓN CORREGIDA: Genera 10 celdas y usa los nombres de campo correctos del JSON.
 */
function construirDetalleNotaCredito(filas) {
  if (!filas || !Array.isArray(filas)) return '';
  let html = '';
  filas.forEach(item => {

    // --- Lógica para los detalles adicionales (se mantiene igual) ---
    let detalleAdicionalHtml = '';
    if (item.detalle01 && item.detalle01.trim() !== '') {
      const detalleFormateado = item.detalle01.replace(/\n/g, '<br>');
      detalleAdicionalHtml = `<br><small style="color: #444; line-height: 1.1;">${detalleFormateado}</small>`;
    }
    // --- FIN DE LA LÓGICA ---

    // Construimos la fila <tr> con las 10 columnas correctas de la Nota de Crédito
    html += `
      <tr>
        <td style="text-align: center;">${item.codigo || ''}</td>
        <td>${item.nombre || ''}${detalleAdicionalHtml}</td>
        <td style="text-align: center;">${formatearMonto(item.cantidad || '0.00')}</td>
        <td style="text-align: center;">${item.unidad || ''}</td>
        <td style="text-align: right;">${formatearMonto(item.valor_unitario || '0.00')}</td>
        <td style="text-align: right;">${formatearMonto(item.descuento || '0.00')}</td>
        <td style="text-align: right;">${formatearMonto(item.precio_venta || '0.00')}</td>
        <td style="text-align: right;">${formatearMonto(item.valor_venta_total || '0.00')}</td>
        <td style="text-align: right;">${formatearMonto(item.igv_item || '0.00')}</td>
        <td style="text-align: right;">${formatearMonto(item.total_linea || '0.00')}</td>
      </tr>
    `;
  });
  return html;
}



/**
 * Construye las filas <tr> para la tabla de CUOTAS.
 * Es una función genérica ya que la tabla de cuotas suele ser igual.
 */
function construirCuotas(filas) {
  if (!filas || !Array.isArray(filas)) return '';
  let html = '';
  filas.forEach(cuota => {
    html += `
      <tr>
        <td>${cuota.numero_cuota || ''}</td>
        <td>${cuota.fecha_pago || ''}</td>
        <td style="text-align: right;">${formatearMonto(cuota.monto || '0.00')}</td>
      </tr>
    `;
  });
  return html;
}


