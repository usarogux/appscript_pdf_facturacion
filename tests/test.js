function funcionTest() {
  // 🔹 1. El JSON exacto que enviaste desde AppSheet y capturaste.
  const jsonDePrueba = `
  {
  "transaccion": "FE",
  "tipo_tra": "FE",
  "transaccion_numero": "FE01-00000001",
  "fecha_emi": "12/09/2025",
  "fecha_ven": "22/09/2025",
  "fecha_reg": "12/09/2025 20:14",
  "anexo_nombre": "INVERSIONES WIN TAC SERVICIOS GENERALES E.I.R.LTDA",
  "anexo_ruc": "20209098114",
  "anexo_dir": "",
  "logo": "b41f88a2.logo.192931.png",
  "negocio_ruc": "20608905074",
  "cp_tit": "INDUSTRIAS PROALIMENTOS S.A.C.",
  "cp_dir1": "CAL.LOS CEREZOS NRO. 291 LOT.LOT.",
  "cp_dir2": "SEMI RÙSTICA DE CHILLÒN LIMA - LIMA",
  "cp_dir3": "PUENTE PIEDRA PUENTE PIEDRA - LIMA - LIMA",
  "cp_dir4": "",
  "cp_dir5": "",
  "cp_email": "",
  "numero_archivo": "999",
  "cp_tel": "956659271",
  "anexo_documento_nombre": "RUC",
  "forma_pago": "Credito 10 días",
  "forma_pago_simple": "Credito",
  "referencia": "",
  "moneda_texto": "Soles",
  "subtotal_ventas": "20587.5",
  "anticipos": "0",
  "descuentos": "0",
  "valor_venta": "20587.5",
  "isc": "0",
  "igv": "3705.75",
  "icbper": "0.00",
  "otros_cargos": "0.00",
  "otros_tributos": "0.00",
  "total_venta": "24293.25",
  "moneda_simbolo": "PEN",
  "imagen_qr_respuesta": "",
  "op_gratuitas": "0",
  "op_exoneradas": "0",
  "op_inafectas": "0",
  "monto_det": "0",
  "nro_cta": "",
  "porc_det": " %",
  "monto_detSol": "S/ 0",
  "mostrarDetraccion": "false",
  "doc_relacionado01": "",
  "observacion01": "",
  "th_co": "#0A2342",
  "folderId": "1b0toh6Ox5Ega8Fr5Z3CML7hj1oPiH62F",
  "folder_empresa": "19UbqH-X4-GiVn2K7mDOQ2FulQBSRNo3P",
  "filas_cuotas": [
    {
      "numero_cuota": "1",
      "fecha_pago": "22/09/2025",
      "monto": "24293.25"
    }
  ],
  "filas_detalle": [
    {
      "codigo": "0100001",
      "nombre": "GRANO SIMIL",
      "cantidad": "1525",
      "unidad": "KGM",
      "valor_unitario": "13.5",
      "descuento": "0",
      "precio_venta": "15.930",
      "valor_venta_total": "20587.5",
      "igv_item": "3705.75",
      "total_linea": "24293.25",
      "detalle01": "Marca: CONFe alimentos fortificados"
    },
    {
      "codigo": "0100001",
      "nombre": "GRANO SIMIL",
      "cantidad": "1525",
      "unidad": "KGM",
      "valor_unitario": "13.5",
      "descuento": "0",
      "precio_venta": "15.930",
      "valor_venta_total": "20587.5",
      "igv_item": "3705.75",
      "total_linea": "24293.25",
      "detalle01": "Marca: CONFe alimentos fortificados"
    },
    {
      "codigo": "0100001",
      "nombre": "GRANO SIMIL",
      "cantidad": "1525",
      "unidad": "KGM",
      "valor_unitario": "13.5",
      "descuento": "0",
      "precio_venta": "15.930",
      "valor_venta_total": "20587.5",
      "igv_item": "3705.75",
      "total_linea": "24293.25",
      "detalle01": "Marca: CONFe alimentos fortificados"
    },
    {
      "codigo": "0100001",
      "nombre": "GRANO SIMIL",
      "cantidad": "1525",
      "unidad": "KGM",
      "valor_unitario": "13.5",
      "descuento": "0",
      "precio_venta": "15.930",
      "valor_venta_total": "20587.5",
      "igv_item": "3705.75",
      "total_linea": "24293.25",
      "detalle01": "Marca: CONFe alimentos fortificados"
    },
    {
      "codigo": "0100001",
      "nombre": "GRANO SIMIL",
      "cantidad": "1525",
      "unidad": "KGM",
      "valor_unitario": "13.5",
      "descuento": "0",
      "precio_venta": "15.930",
      "valor_venta_total": "20587.5",
      "igv_item": "3705.75",
      "total_linea": "24293.25",
      "detalle01": "Marca: CONFe alimentos fortificados"
    },
    {
      "codigo": "0100001",
      "nombre": "GRANO SIMIL",
      "cantidad": "1525",
      "unidad": "KGM",
      "valor_unitario": "13.5",
      "descuento": "0",
      "precio_venta": "15.930",
      "valor_venta_total": "20587.5",
      "igv_item": "3705.75",
      "total_linea": "24293.25",
      "detalle01": "Marca: CONFe alimentos fortificados"
    },
    {
      "codigo": "0100001",
      "nombre": "GRANO SIMIL",
      "cantidad": "1525",
      "unidad": "KGM",
      "valor_unitario": "13.5",
      "descuento": "0",
      "precio_venta": "15.930",
      "valor_venta_total": "20587.5",
      "igv_item": "3705.75",
      "total_linea": "24293.25",
      "detalle01": "Marca: CONFe alimentos fortificados"
    },
    {
      "codigo": "0100001",
      "nombre": "GRANO SIMIL",
      "cantidad": "1525",
      "unidad": "KGM",
      "valor_unitario": "13.5",
      "descuento": "0",
      "precio_venta": "15.930",
      "valor_venta_total": "20587.5",
      "igv_item": "3705.75",
      "total_linea": "24293.25",
      "detalle01": "Marca: CONFe alimentos fortificados"
    },
    {
      "codigo": "0100001",
      "nombre": "GRANO SIMIL",
      "cantidad": "1525",
      "unidad": "KGM",
      "valor_unitario": "13.5",
      "descuento": "0",
      "precio_venta": "15.930",
      "valor_venta_total": "20587.5",
      "igv_item": "3705.75",
      "total_linea": "24293.25",
      "detalle01": "Marca: CONFe alimentos fortificados"
    },
    {
      "codigo": "0100001",
      "nombre": "GRANO SIMIL",
      "cantidad": "1525",
      "unidad": "KGM",
      "valor_unitario": "13.5",
      "descuento": "0",
      "precio_venta": "15.930",
      "valor_venta_total": "20587.5",
      "igv_item": "3705.75",
      "total_linea": "24293.25",
      "detalle01": "Marca: CONFe alimentos fortificados"
    },
    {
      "codigo": "0100001",
      "nombre": "GRANO SIMIL",
      "cantidad": "1525",
      "unidad": "KGM",
      "valor_unitario": "13.5",
      "descuento": "0",
      "precio_venta": "15.930",
      "valor_venta_total": "20587.5",
      "igv_item": "3705.75",
      "total_linea": "24293.25",
      "detalle01": "Marca: CONFe alimentos fortificados"
    },
    {
      "codigo": "0100001",
      "nombre": "GRANO SIMIL",
      "cantidad": "1525",
      "unidad": "KGM",
      "valor_unitario": "13.5",
      "descuento": "0",
      "precio_venta": "15.930",
      "valor_venta_total": "20587.5",
      "igv_item": "3705.75",
      "total_linea": "24293.25",
      "detalle01": "Marca: CONFe alimentos fortificados"
    },
    {
      "codigo": "0100001",
      "nombre": "GRANO SIMIL",
      "cantidad": "1525",
      "unidad": "KGM",
      "valor_unitario": "13.5",
      "descuento": "0",
      "precio_venta": "15.930",
      "valor_venta_total": "20587.5",
      "igv_item": "3705.75",
      "total_linea": "24293.25",
      "detalle01": "Marca: CONFe alimentos fortificados"
    },
    {
      "codigo": "0100001",
      "nombre": "GRANO SIMIL",
      "cantidad": "1525",
      "unidad": "KGM",
      "valor_unitario": "13.5",
      "descuento": "0",
      "precio_venta": "15.930",
      "valor_venta_total": "20587.5",
      "igv_item": "3705.75",
      "total_linea": "24293.25",
      "detalle01": "Marca: CONFe alimentos fortificados"
    },
    {
      "codigo": "0100001",
      "nombre": "GRANO SIMIL",
      "cantidad": "1525",
      "unidad": "KGM",
      "valor_unitario": "13.5",
      "descuento": "0",
      "precio_venta": "15.930",
      "valor_venta_total": "20587.5",
      "igv_item": "3705.75",
      "total_linea": "24293.25",
      "detalle01": "Marca: CONFe alimentos fortificadosult"
    }
  ]
}
  `;

  try {
    // 🔹 2. Simulamos el proceso del doPost
    console.log("Iniciando prueba...");
    const datos = JSON.parse(jsonDePrueba);
    
    // 🔹 3. Llamamos a la función que queremos depurar
    generarPdfDinamico(datos);

    console.log("✅ PRUEBA FINALIZADA: La función 'generarPdfDinamico' se ejecutó sin lanzar errores.");

  } catch (error) {
    // 🔹 4. Si algo falla, lo mostraremos aquí de forma muy detallada
    console.error("❌ ERROR DURANTE LA PRUEBA:");
    console.error("Mensaje: " + error.message);
    console.error("Línea de error: " + error.lineNumber);
    console.error("Archivo: " + error.fileName);
    console.error("Stack Trace: " + error.stack);
  }
}