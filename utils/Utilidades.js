// =============================================================
// 🔹 FUNCIONES AUXILIARES (COMPARTIDAS)
// =============================================================
function parseQueryString(queryString) { if (!queryString) return {}; var params = {}; var queries = queryString.split("&"); for (var i = 0; i < queries.length; i++) { var pair = queries[i].split("="); params[pair[0]] = decodeURIComponent(pair[1] || ""); } return params; }
function procesarFilasGenerico(filas, tipoDocumento) { if (!filas || filas.trim() === '-') return ''; 

const estructuras = { 
"FE": { indices: { nombre: 0, cantidad: 1, precio: 2, importe: 3 } }, 
"BE": { indices: { nombre: 0, cantidad: 1, precio: 2, importe: 3 } },
"CO": { indices: { nombre: 0, cantidad: 1, precio: 2, importe: 3 } },  
"CF": { indices: { nombre: 0, cantidad: 1, precio: 2, importe: 3 } } }; 
const estructura = estructuras[tipoDocumento] || {}; var filasArray = filas.split('®').filter(fila => fila.trim() !== ""); var resultado = ''; filasArray.forEach(fila => { var columnas = fila.replace(/^~|~|^\^~|\|/g, '').split('¶').map(valor => valor.trim()); if (estructura.indices) { const nombre = columnas[estructura.indices.nombre] || '-'; const cantidadCompleta = columnas[estructura.indices.cantidad] || '-'; const cantidad = cantidadCompleta.split(' ')[0]; const precio = formatearMonto(columnas[estructura.indices.precio] || '0.00'); const importe = formatearMonto(columnas[estructura.indices.importe] || '0.00'); resultado += `<tr><td style="width: 50%;">${nombre}</td><td style="width: 15%; text-align: center;">${cantidad}</td><td style="width: 15%; text-align: right;">${precio}</td><td style="width: 20%; text-align: right;">${importe}</td></tr>`; } }); return resultado; }


function procesarFilasGuia(htmlFilas) { if (!htmlFilas) return ""; return htmlFilas.replace(/\|/g, ""); }

function formatearMonto(monto) { return parseFloat(monto).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }); }


/**
 * Convierte un número en su representación en letras.
 * VERSIÓN CORREGIDA para manejar centenas y casos especiales.
 */
function numeroALetras(num) {
    const unidades = ["", "UN", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"];
    const decenas = ["DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISEIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE"];
    const veintes = ["VEINTE", "VEINTIUN", "VEINTIDOS", "VEINTITRES", "VEINTICUATRO", "VEINTICINCO", "VEINTISEIS", "VEINTISIETE", "VEINTIOCHO", "VEINTINUEVE"];
    const decenasCompuestas = ["", "", "", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
    const centenas = ["", "CIENTO", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS", "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"];

    if (num === 0) return "CERO";
    if (num < 0) return "MENOS " + numeroALetras(Math.abs(num));

    let letras = "";

    function getParte(n) {
        let parte = "";
        let c = Math.floor(n / 100);
        let d = Math.floor((n % 100) / 10);
        let u = n % 10;

        if (c > 0) {
            parte += (n === 100) ? "CIEN" : centenas[c];
            if (n % 100 !== 0) parte += " ";
        }
        
        let du = n % 100;
        if (du > 0) {
            if (du < 10) {
                parte += unidades[du];
            } else if (du < 20) {
                parte += decenas[du - 10];
            } else if (du < 30) {
                parte += (du === 20) ? "VEINTE" : veintes[du - 20];
            } else {
                parte += decenasCompuestas[d];
                if (u > 0) {
                    parte += " Y " + unidades[u];
                }
            }
        }
        return parte;
    }

    let millones = Math.floor(num / 1000000);
    let restoMillones = num % 1000000;
    if (millones > 0) {
        letras += (millones === 1) ? "UN MILLON " : getParte(millones) + " MILLONES ";
    }

    let miles = Math.floor(restoMillones / 1000);
    let resto = restoMillones % 1000;
    if (miles > 0) {
        letras += (miles === 1) ? "MIL " : getParte(miles) + " MIL ";
    }

    if (resto > 0) {
        letras += getParte(resto);
    }

    return letras.trim();
}

/**
 * Convierte un monto numérico a su representación en letras,
 * asegurando siempre dos decimales.
 * @param {number} num - El número a convertir.
 * @param {string} moneda - El nombre de la moneda (ej: "SOLES").
 * @returns {string} - El monto completo en letras.
 */
function montoEnLetras(num, moneda) {
    const total = parseFloat(num).toFixed(2); // Asegura que siempre haya 2 decimales
    const parteEntera = Math.floor(total);
    const parteDecimal = Math.round((total - parteEntera) * 100);

    const letrasEntero = numeroALetras(parteEntera);
    const dec = (parteDecimal < 10) ? "0" + parteDecimal : parteDecimal;

    return "SON " + letrasEntero + " CON " + dec + "/100 " + (moneda || "").toUpperCase();
}


function obtenerQRUrl(data) { if (!data) return ""; return `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(data)}`; }


function guardarDocumento(htmlContent, transaccion, transaccion_numero, folderId, numero_archivo) {
  const maxRetries = 3; // Intentará hasta 3 veces
  let lastError = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const blob = Utilities.newBlob(htmlContent, "text/html", transaccion + "_" + transaccion_numero + ".html");
      const pdfBlob = blob.getAs("application/pdf");
      const nombreArchivo = transaccion + "_" + transaccion_numero + "(" + numero_archivo + ").pdf";
      
      const carpeta = DriveApp.getFolderById(folderId);
      
      const archivos = carpeta.getFilesByName(nombreArchivo);
      while (archivos.hasNext()) {
        archivos.next().setTrashed(true);
      }
      
      const archivoSubido = carpeta.createFile(pdfBlob);
      archivoSubido.setName(nombreArchivo);
      
      Logger.log(`✅ Documento PDF guardado en Drive en el intento ${i + 1}.`);
      return archivoSubido.getUrl(); // Si tiene éxito, devuelve la URL y sale de la función

    } catch (error) {
      Logger.log(`⚠️ Intento ${i + 1} falló al guardar el PDF: ${error.message}`);
      lastError = error;
      if (i < maxRetries - 1) {
        Utilities.sleep(1000); // Espera 1 segundo antes de reintentar
      }
    }
  }
  
  // Si todos los intentos fallan, lanza el último error capturado.
  throw new Error("Fallaron todos los intentos para guardar en Drive. Último error: " + lastError.message);
}

function obtenerQRBase64(data) {
  Logger.log("--- INICIANDO PROCESO DE GENERACIÓN DE QR ---");
  Logger.log("1. Dato recibido para convertir en QR: " + data);

  try {
    if (!data || data.trim() === "") {
      Logger.log("2. ERROR: El dato para el QR está vacío o nulo. Abortando generación de QR.");
      return ""; // Devuelve vacío si no hay datos
    }

    const urlQrService = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}`;
    Logger.log("2. URL que se enviará al servicio de QR: " + urlQrService);
    
    const qrServiceResponse = UrlFetchApp.fetch(urlQrService);
    const responseCode = qrServiceResponse.getResponseCode();
    Logger.log("3. Respuesta del servidor de QR: Código " + responseCode);

    if (responseCode !== 200) {
      throw new Error("El servidor de QR devolvió un código de estado no exitoso: " + responseCode);
    }
    
    const imageBlob = qrServiceResponse.getBlob();
    const qrBase64 = Utilities.base64Encode(imageBlob.getBytes());
    
    Logger.log("4. El QR se ha generado y codificado a Base64 correctamente.");
    
    return `data:image/png;base64,${qrBase64}`;

  } catch (error) {
    Logger.log("5. ¡FALLO CRÍTICO! Error durante la generación del QR: " + error.message);
    return ""; // Devuelve vacío en caso de error
  }
}

function obtenerImagenBase64DesdeDrivePorCarpeta(idCarpeta, rutaImagen) {
  if (!idCarpeta || !rutaImagen) return "";
  
  const maxRetries = 3; // Intentará hasta 3 veces
  let lastError = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      var nombreArchivo = rutaImagen.split('/').pop();
      var carpeta = DriveApp.getFolderById(idCarpeta);
      var archivos = carpeta.getFilesByName(nombreArchivo);

      if (!archivos.hasNext()) {
        throw new Error(`Archivo no encontrado: ${nombreArchivo}`);
      }
      
      var archivo = archivos.next();
      var blob = archivo.getBlob();
      var base64 = Utilities.base64Encode(blob.getBytes());
      
      Logger.log(`✅ Imagen '${nombreArchivo}' obtenida en el intento ${i + 1}.`);
      return `data:${blob.getContentType()};base64,${base64}`;

    } catch (error) {
      Logger.log(`⚠️ Intento ${i + 1} falló al obtener la imagen: ${error.message}`);
      lastError = error;
      if (i < maxRetries - 1) {
        Utilities.sleep(1000); // Espera 1 segundo antes de reintentar
      }
    }
  }
  
  // Si todos los intentos fallan, registra el último error y devuelve vacío.
  Logger.log(`❌ Fallaron todos los intentos para obtener la imagen. Último error: ${lastError.message}`);
  return "";
}

function procesarFilasFacturaCompleja(filasString) { if (!filasString) return ""; return filasString.replace(/\|/g, ""); }

function procesarFilasCuotas(cuotasString) {
  if (!cuotasString || cuotasString.trim() === '-') return '';
  let htmlResultante = '';
  const filasArray = cuotasString.split('®').filter(fila => fila.trim() !== "");
  filasArray.forEach(fila => {
    const columnas = fila.replace(/^~|~|^\^~|\|/g, '').split('¶').map(valor => valor.trim());
    const numeroCuota = columnas[0] || '-';
    const fechaVenc = columnas[1] || '-';
    const montoCuota = formatearMonto(columnas[2] || '0.00');
    htmlResultante += `<tr><td>${numeroCuota}</td><td>${fechaVenc}</td><td>${montoCuota}</td></tr>`;
  });
  return htmlResultante;
}