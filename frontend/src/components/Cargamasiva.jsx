// El cargador de archivos CSV para el mes

import React, { useState } from 'react';

export default function Cargamasiva() {
  const [cargando, setCargando] = useState(false);
  const [respuesta, setRespuesta] = useState(null);

  const handleFileChange = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    setCargando(true);
    setRespuesta(null);
    const lector = new FileReader();

    lector.onload = async (evento) => {
      try {
        const texto = evento.target.result;
        const lineas = texto.split(/\r?\n/);
        const encabezados = lineas[0].split(',').map(h => h.trim().toLowerCase());
        const loteDeDatos = [];

        for (let i = 1; i < lineas.length; i++) {
          if (!lineas[i].trim()) continue;
          const valores = lineas[i].split(',');
          const fila = {};
          
          encabezados.forEach((encabezado, indice) => {
            fila[encabezado] = valores[indice]?.trim();
          });
          loteDeDatos.push(fila);
        }

        // Enviamos el lote completo de datos brutos a Node.js
        const peticion = await fetch('http://localhost:5000/api/balances/guardar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loteDeDatos),
        });

        const resultado = await peticion.json();

        if (!peticion.ok) throw new Error(resultado.error || 'Error procesando lote.');

        setRespuesta({ tipo: 'exito', texto: `¡Éxito! Se cargó correctamente el mes con ${loteDeDatos.length} registros.` });
      } catch (err) {
        setRespuesta({ tipo: 'error', texto: err.message });
      } finally {
        setCargando(false);
      }
    };

    lector.readAsText(archivo);
  };

  return (
    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#0f172a' }}>Carga Masiva Mensual (.CSV)</h3>
      <p style={{ color: '#475569', fontSize: '0.85rem', marginBottom: '15px' }}>
        Sube un archivo de Excel guardado como formato CSV conteniendo los datos operativos del mes completo.
      </p>
      <div style={{ border: '2px dashed #cbd5e1', padding: '20px', textAlign: 'center', background: '#fff', borderRadius: '6px' }}>
        <input type="file" accept=".csv" onChange={handleFileChange} disabled={cargando} />
        {cargando && <p style={{ color: '#2563eb', margin: '10px 0 0 0', fontWeight: 'bold' }}>Transmitiendo mes al servidor backend...</p>}
      </div>

      {respuesta && (
        <div style={{ marginTop: '15px', padding: '10px', borderRadius: '4px', fontSize: '0.9rem', background: respuesta.tipo === 'exito' ? '#f0fdf4' : '#fef2f2', color: respuesta.tipo === 'exito' ? '#166534' : '#991b1b', border: `1px solid ${respuesta.tipo === 'exito' ? '#bbf7d0' : '#fca5a5'}` }}>
          {respuesta.texto}
        </div>
      )}
    </div>
  );
}