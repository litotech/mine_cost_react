import React, { useState } from 'react';

// Constante global de conversión
const OZ_TROY_GR = 31.1035;

export default function BalanceMetalurgico() {
  // 1. Estado inicial con tus parámetros por turno
  const [inputs, setInputs] = useState({
    fecha: new Date().toISOString().split('T')[0],
    turno: 'Mañana',
    tmh_tratadas: 31.36,
    humedad_porcentaje: 3.48,
    ley_cabeza_au: 4.25,
    espiral_ley_au: 32.57,
    espiral_conc_tms_dia: 0.2,
    icon_ley_au: 611.03,
    icon_conc_tms_dia: 0.035,
    flotacion_ley_au: 66.51,
    flotacion_conc_tms_dia: 1.45,
    ley_relave_au: 0.15,
  });

  // Manejador genérico para actualizar inputs numéricos y de texto
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  // 2. Motor de cálculo lógico (Equivalente al código de Python)
  const realizarCalculos = () => {
    const {
      tmh_tratadas, humedad_porcentaje, ley_cabeza_au,
      espiral_ley_au, espiral_conc_tms_dia,
      icon_ley_au, icon_conc_tms_dia,
      flotacion_ley_au, flotacion_conc_tms_dia,
      ley_relave_au
    } = inputs;

    // Cabeza
    const tms_tratadas = tmh_tratadas * (1 - (humedad_porcentaje / 100));
    const contenido_cabeza_gr = tms_tratadas * ley_cabeza_au;

    // Circuitos & Ratios
    const ratio_espiral = espiral_conc_tms_dia > 0 ? tms_tratadas / espiral_conc_tms_dia : 0;
    const contenido_espiral_oz = (espiral_ley_au * espiral_conc_tms_dia) / OZ_TROY_GR;

    const ratio_icon = icon_conc_tms_dia > 0 ? tms_tratadas / icon_conc_tms_dia : 0;
    const contenido_icon_oz = (icon_ley_au * icon_conc_tms_dia) / OZ_TROY_GR;

    const ratio_flotacion = flotacion_conc_tms_dia > 0 ? tms_tratadas / flotacion_conc_tms_dia : 0;
    const contenido_flotacion_oz = (flotacion_ley_au * flotacion_conc_tms_dia) / OZ_TROY_GR;

    // Totales
    const produccion_diaria_gr = (contenido_espiral_oz + contenido_icon_oz + contenido_flotacion_oz) * OZ_TROY_GR;
    const produccion_diaria_oz = produccion_diaria_gr / OZ_TROY_GR;

    // Recuperaciones
    const recuperacion_contenido = contenido_cabeza_gr > 0 ? (produccion_diaria_gr / contenido_cabeza_gr) * 100 : 0;
    const recuperacion_leyes = ley_cabeza_au > 0 ? ((ley_cabeza_au - ley_relave_au) / ley_cabeza_au) * 100 : 0;

    return {
      tms_tratadas: tms_tratadas.toFixed(4),
      contenido_cabeza_gr: contenido_cabeza_gr.toFixed(4),
      espiral: { ratio: ratio_espiral.toFixed(2), oz: contenido_espiral_oz.toFixed(4) },
      icon: { ratio: ratio_icon.toFixed(2), oz: contenido_icon_oz.toFixed(4) },
      flotacion: { ratio: ratio_flotacion.toFixed(2), oz: contenido_flotacion_oz.toFixed(4) },
      produccion_gr: produccion_diaria_gr.toFixed(4),
      produccion_oz: produccion_diaria_oz.toFixed(4),
      rec_contenido: recuperacion_contenido.toFixed(2),
      rec_leyes: recuperacion_leyes.toFixed(2),
    };
  };

  const resultados = realizarCalculos();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
        Balance Metalúrgico Diario — Planta de Beneficio de Oro
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3>Ingreso de Datos Operativos</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
            <label>Fecha:
              <input type="date" name="fecha" value={inputs.fecha} onChange={handleChange} style={inputStyle} />
            </label>
            <label>Turno:
              <select name="turno" value={inputs.turno} onChange={handleChange} style={inputStyle}>
                <option value="Mañana">Mañana</option>
                <option value="Tarde">Tarde</option>
              </select>
            </label>
          </div>

          <h4>Control de Alimentación (Cabeza)</h4>
          <div style={gridInputsStyle}>
            <label>TMH Tratadas: <input type="number" name="tmh_tratadas" value={inputs.tmh_tratadas} onChange={handleChange} style={inputStyle} /></label>
            <label>Humedad (%): <input type="number" name="humedad_porcentaje" value={inputs.humedad_porcentaje} onChange={handleChange} style={inputStyle} /></label>
            <label>Ley Cabeza (g/t): <input type="number" name="ley_cabeza_au" value={inputs.ley_cabeza_au} onChange={handleChange} style={inputStyle} /></label>
          </div>

          <h4>Circuitos de Concentración</h4>
          <h5 style={{ margin: '5px 0' }}>Concentración Espiral</h5>
          <div style={gridInputsStyle}>
            <label>Ley Au (g/TMS): <input type="number" name="espiral_ley_au" value={inputs.espiral_ley_au} onChange={handleChange} style={inputStyle} /></label>
            <label>Concentrado (TMS): <input type="number" name="espiral_conc_tms_dia" value={inputs.espiral_conc_tms_dia} onChange={handleChange} style={inputStyle} /></label>
          </div>

          <h5 style={{ margin: '5px 0' }}>Concentración ICON 350</h5>
          <div style={gridInputsStyle}>
            <label>Ley Au (g/TMS): <input type="number" name="icon_ley_au" value={inputs.icon_ley_au} onChange={handleChange} style={inputStyle} /></label>
            <label>Concentrado (TMS): <input type="number" name="icon_conc_tms_dia" value={inputs.icon_conc_tms_dia} onChange={handleChange} style={inputStyle} /></label>
          </div>

          <h5 style={{ margin: '5px 0' }}>Concentración Flotación</h5>
          <div style={gridInputsStyle}>
            <label>Ley Au (g/TMS): <input type="number" name="flotacion_ley_au" value={inputs.flotacion_ley_au} onChange={handleChange} style={inputStyle} /></label>
            <label>Concentrado (TMS): <input type="number" name="flotacion_conc_tms_dia" value={inputs.flotacion_conc_tms_dia} onChange={handleChange} style={inputStyle} /></label>
          </div>

          <h4>Salidas de Cola</h4>
          <div style={gridInputsStyle}>
            <label>Ley Relave (g/TMS): <input type="number" name="ley_relave_au" value={inputs.ley_relave_au} onChange={handleChange} style={inputStyle} /></label>
          </div>
        </div>

        {/* COLUMNA DERECHA: REPORTES EN TIEMPO REAL */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#1e293b' }}>Resultados del Turno — {inputs.turno}</h3>
          <p><strong>Mineral Procesado Seco:</strong> {resultados.tms_tratadas} TMS</p>
          <p><strong>Fino en Cabeza:</strong> {resultados.contenido_cabeza_gr} g Au</p>
          
          <hr style={{ margin: '15px 0', border: '0', borderTop: '1px solid #e2e8f0' }} />

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                <th style={tableHeaderStyle}>Circuito</th>
                <th style={tableHeaderStyle}>Ratio Concentración</th>
                <th style={tableHeaderStyle}>Contenido (Oz Troy)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tableCellStyle}><strong>Espiral</strong></td>
                <td style={tableCellStyle}>{resultados.espiral.ratio}</td>
                <td style={tableCellStyle}>{resultados.espiral.oz} Oz</td>
              </tr>
              <tr>
                <td style={tableCellStyle}><strong>ICON 350</strong></td>
                <td style={tableCellStyle}>{resultados.icon.ratio}</td>
                <td style={tableCellStyle}>{resultados.icon.oz} Oz</td>
              </tr>
              <tr>
                <td style={tableCellStyle}><strong>Flotación</strong></td>
                <td style={tableCellStyle}>{resultados.flotacion.ratio}</td>
                <td style={tableCellStyle}>{resultados.flotacion.oz} Oz</td>
              </tr>
            </tbody>
          </table>

          <div style={{ background: '#f0fdf4', padding: '15px', borderRadius: '6px', marginBottom: '15px', border: '1px solid #bbf7d0' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#166534' }}>Producción Diaria Obtenida</h4>
            <p style={{ margin: '0', fontSize: '1.25rem', fontWeight: 'bold', color: '#14532d' }}>
              {resultados.produccion_gr} g Au <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>({resultados.produccion_oz} Oz)</span>
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={boxRecuperacionStyle}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Recuperación (Contenido)</span>
              <strong style={{ fontSize: '1.4rem', color: '#0f172a', display: 'block' }}>{resultados.rec_contenido}%</strong>
            </div>
            <div style={boxRecuperacionStyle}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Recuperación (Leyes)</span>
              <strong style={{ fontSize: '1.4rem', color: '#0f172a', display: 'block' }}>{resultados.rec_leyes}%</strong>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Estilos rápidos en línea para asegurar la portabilidad del componente
const inputStyle = { width: '100%', padding: '6px', marginTop: '4px', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box' };
const gridInputsStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' };
const tableHeaderStyle = { padding: '10px', fontSize: '0.9rem', color: '#475569', borderBottom: '2px solid #cbd5e1' };
const tableCellStyle = { padding: '10px', borderBottom: '1px solid #e2e8f0', fontSize: '0.95rem' };
const boxRecuperacionStyle = { background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', textAlign: 'center' };