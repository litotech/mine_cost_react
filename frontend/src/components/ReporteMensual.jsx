// NUEVO: Tabla/Dashboard con los totales mensuales

import React, { useEffect, useState } from 'react';

export default function ReporteMensual() {
  const [totales, setTotales] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarTotales() {
      try {
        const res = await fetch('http://localhost:5000/api/balances/totales-mensuales');
        const data = await res.json();
        if (res.ok) setTotales(data);
      } catch (err) {
        console.error('Error al traer totales mensuales:', err);
      } finally {
        setCargando(false);
      }
    }
    cargarTotales();
  }, []);

  if (cargando) return <p style={{ padding: '10px', color: '#64748b' }}>Consultando cierres mensuales...</p>;

  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
      <h3 style={{ color: '#0f172a', margin: '0 0 15px 0' }}>📈 Cierres Totales Acumulados Mensuales</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ background: '#0f172a', color: '#fff', textAlign: 'left' }}>
            <th style={thStyle}>Mes</th>
            <th style={thStyle}>Turnos</th>
            <th style={thStyle}>Total TMS</th>
            <th style={thStyle}>Cabeza (g Au)</th>
            <th style={thStyle}>Espiral (TMS)</th>
            <th style={thStyle}>ICON 350 (TMS)</th>
            <th style={thStyle}>Flotación (TMS)</th>
            <th style={thStyle}>Prod (g)</th>
            <th style={thStyle}>Prod (Oz)</th>
            <th style={thStyle}>Recup %</th>
          </tr>
        </thead>
        <tbody>
          {totales.map((m) => (
            <tr key={m.mes_periodo} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ ...tdStyle, fontWeight: 'bold' }}>{m.mes_periodo}</td>
              <td style={tdStyle}>{m.total_turnos_registrados}</td>
              <td style={tdStyle}>{Number(m.total_tms).toFixed(2)}</td>
              <td style={tdStyle}>{Number(m.total_contenido_cabeza_gr).toFixed(2)}</td>
              <td style={tdStyle}>{Number(m.total_concentrado_espiral_tms).toFixed(3)}</td>
              <td style={tdStyle}>{Number(m.total_concentrado_icon_tms).toFixed(3)}</td>
              <td style={tdStyle}>{Number(m.total_concentrado_flotacion_tms).toFixed(3)}</td>
              <td style={{ ...tdStyle, color: '#166534', fontWeight: 'bold' }}>{Number(m.total_produccion_gr).toFixed(2)}</td>
              <td style={{ ...tdStyle, color: '#166534', fontWeight: 'bold' }}>{Number(m.total_produccion_oz).toFixed(2)} Oz</td>
              <td style={{ ...tdStyle, background: '#f0fdf4', fontWeight: 'bold', color: '#166534', textAlign: 'center' }}>
                {Number(m.recuperacion_global_contenido).toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = { padding: '10px' };
const tdStyle = { padding: '10px', color: '#334155' };