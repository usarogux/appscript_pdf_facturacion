// =============================================================
// 🔹 ID DE LA HOJA DE CÁLCULO (IMPORTANTE PARA STANDALONE)
// =============================================================
// REEMPLAZA ESTE ID CON EL ID DE TU HOJA DE CÁLCULO
// Lo encuentras en la URL: https://docs.google.com/spreadsheets/d/[ESTE_ID]/edit
const SPREADSHEET_ID = "1wxwsPAfLZPv4d0aW6txQ49UkW30ojRht8yI6QJyk-d0";

// =============================================================
// 🔹 FUNCIÓN HELPER PARA OBTENER EL SPREADSHEET
// =============================================================
function getSpreadsheet() {
  if (!SPREADSHEET_ID || SPREADSHEET_ID === "T1wxwsPAfLZPv4d0aW6txQ49UkW30ojRht8yI6QJyk-d0") {
    throw new Error("⚠️ ERROR: Debes configurar el SPREADSHEET_ID en Configuracion_hojas.js");
  }
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

// --- CONFIGURACIÓN PARA FACTURAS, BOLETAS, NC (Hoja: cabecera) ---
const HOJA_DATOS_FACTURA = "cabecera";
const COL_ID_FACTURA = 1;
const COL_JSON_FACTURA = 77;
const COL_IMPRESION_FACTURA = 78;
const COL_ESTADO_FACTURA = 55;
const COL_MENSAJE_FACTURA = 31;
const COL_ERROR_FACTURA = 60;
const COL_HASH_FACTURA = 30;
const COLUMNA_ESTADO_SYNC = 80;

// --- CONFIGURACIÓN PARA GUÍAS DE REMISIÓN (Hoja: cabecera02) ---
const HOJA_DATOS_GUIA = "cabecera02";
const COL_ID_GUIA = 1;
const COL_JSON_GUIA = 30;
const COL_IMPRESION_GUIA = 31;
const COL_ESTADO_GUIA = 25;
const COL_MENSAJE_GUIA = 27;
const COL_ERROR_GUIA = 26;
const COL_HASH_GUIA = 24;

//---CONFIGURACION PARA COTIZACIONES---
const HOJA_DATOS_COTIZACION = "cabecera04";
const COL_ID_COTIZACION = 1;
const COL_IMPRESION_COTIZACION = 51;