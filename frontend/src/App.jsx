import React, { useState, useEffect } from 'react';

function App() {
  // --- ESTADOS INTERNOS ---
  const [moduloActivo, setModuloActivo] = useState(null);
  const [mensajeStatus, setMensajeStatus] = useState({ tipo: '', texto: '' });
  const [mesSeleccionado, setMesSeleccionado] = useState({ anio: '2024', mes: '04' });
  const [totalesConsolidados, setTotalesConsolidados] = useState(null);
  const [resultadosCalculados, setResultadosCalculados] = useState(null);

  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    turno: 'Mañana',
    tmh_tratadas: '',
    humedad_porcentaje: '',
    ley_cabeza_au: '',
    espiral_ley_au: '',
    espiral_conc_tms_dia: '',
    icon_ley_au: '',
    icon_conc_tms_dia: '',
    flotacion_ley_au: '',
    flotacion_conc_tms_dia: '',
    ley_relave_au: ''
  });

  // --- FIX 1: Una sola declaración de cargarTotalesGenerales ---
  const cargarTotalesGenerales = async (anio, mes) => {
    try {
      const response = await fetch(`http://localhost:5000/api/totales-balance/${anio}/${mes}`);
      const data = await response.json();
      if (response.ok) {
        setTotalesConsolidados(data);
      }
    } catch (err) {
      console.error("Error cargando totales:", err);
    }
  };

  // --- FIX 2: Un solo useEffect ---
  useEffect(() => {
    if (moduloActivo === 'Balance') {
      cargarTotalesGenerales(mesSeleccionado.anio, mesSeleccionado.mes);
    }
  }, [moduloActivo, mesSeleccionado]);

  // --- MANEJADORES DE EVENTOS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGuardarManual = async (e) => {
    e.preventDefault();
    setMensajeStatus({ tipo: 'info', texto: 'Calculando y enviando datos...' });

    const datosFormateados = {
      fecha: formData.fecha,
      turno: formData.turno,
      tmh_tratadas: parseFloat(formData.tmh_tratadas) || 0,
      humedad_porcentaje: parseFloat(formData.humedad_porcentaje) || 0,
      ley_cabeza_au: parseFloat(formData.ley_cabeza_au) || 0,
      espiral_ley_au: parseFloat(formData.espiral_ley_au) || 0,
      espiral_conc_tms_dia: parseFloat(formData.espiral_conc_tms_dia) || 0,
      icon_ley_au: parseFloat(formData.icon_ley_au) || 0,
      icon_conc_tms_dia: parseFloat(formData.icon_conc_tms_dia) || 0,
      flotacion_ley_au: parseFloat(formData.flotacion_ley_au) || 0,
      flotacion_conc_tms_dia: parseFloat(formData.flotacion_conc_tms_dia) || 0,
      ley_relave_au: parseFloat(formData.ley_relave_au) || 0,
    };

    try {
      const response = await fetch('http://localhost:5000/api/guardar-manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosFormateados),
      });
      const resData = await response.json();

      if (!response.ok) throw new Error(resData.error || 'Error en comunicación.');

      setMensajeStatus({ tipo: 'success', texto: resData.message });
      setResultadosCalculados(resData.resultados);

      const [anioRegistro, mesRegistro] = formData.fecha.split('-');
      setMesSeleccionado({ anio: anioRegistro, mes: mesRegistro });
      cargarTotalesGenerales(anioRegistro, mesRegistro);

    } catch (err) {
      setMensajeStatus({ tipo: 'error', texto: err.message });
    }
  };

  const handleCargaMasivaCSV = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMensajeStatus({ tipo: 'info', texto: 'Procesando matriz CSV de forma masiva...' });
    const formDataFile = new FormData();
    formDataFile.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/cargar-masivo-csv', {
        method: 'POST',
        body: formDataFile,
      });
      const resData = await response.json();

      if (!response.ok) throw new Error(resData.error || 'Fallo en la carga.');

      setMensajeStatus({ tipo: 'success', texto: resData.message });
      if (resData.data && resData.data.length > 0) {
        setResultadosCalculados(resData.data[resData.data.length - 1]);
      }

      setMesSeleccionado({ anio: '2024', mes: '04' });
      cargarTotalesGenerales('2024', '04');

    } catch (err) {
      setMensajeStatus({ tipo: 'error', texto: err.message });
    }
  };

  // --- FIX 3: JSX eliminado de fuera del return ---
  return (
    <div style={{
      background: '#080b0f',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px 16px',
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      <div style={{
        width: '100%',
        maxWidth: moduloActivo === 'Balance' ? '1000px' : '480px',
        background: '#0d1117',
        minHeight: '700px',
        borderRadius: '32px',
        overflow: 'hidden',
        position: 'relative',
        border: '1px solid rgba(255,255,255,0.05)',
        transition: 'max-width 0.4s ease'
      }}>
        <div style={{ position: 'relative', zIndex: 1, padding: '40px 28px 32px' }}>

          {/* Status bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.5)' }}>09:41</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#eab308' }} />
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#eab308' }} />
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
            </div>
          </div>

          {/* Logo / Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
            <div onClick={() => setModuloActivo(null)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#eab308,#ca8a04)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 20 20" fill="none" width="20" height="20">
                  <polygon points="10,2 18,7 18,13 10,18 2,13 2,7" fill="none" stroke="#0d1117" strokeWidth="1.5" />
                  <circle cx="10" cy="10" r="3" fill="#0d1117" />
                </svg>
              </div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 700, color: '#fff' }}>
                Mine<span style={{ color: '#eab308' }}>Cost</span>
              </span>
            </div>
            {moduloActivo && (
              <button
                onClick={() => { setModuloActivo(null); setMensajeStatus({ tipo: '', texto: '' }); }}
                style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#eab308', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}
              >
                ← Volver al Menú
              </button>
            )}
          </div>

          {/* --- VISTA DEL MENÚ PRINCIPAL --- */}
          {!moduloActivo ? (
            <>
              <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: 600, color: '#fff', lineHeight: 1.25, marginBottom: '10px' }}>
                  Panel de Control y <span style={{ color: '#eab308' }}>Módulos</span> Operativos
                </h1>
                <div style={{ width: 40, height: 2, background: 'linear-gradient(90deg,#eab308,transparent)', borderRadius: 2, marginBottom: 14 }} />
                <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', fontWeight: 300 }}>
                  Selecciona una sección para gestionar el flujo logístico, comercial y de auditoría financiera.
                </p>
              </div>

              {/* Objetivos */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '18px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <div style={{ width: 28, height: 28, background: 'rgba(234,179,8,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="5.5" stroke="#eab308" strokeWidth="1.2" />
                      <circle cx="7" cy="7" r="2" fill="#eab308" />
                    </svg>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.7)', letterSpacing: '.5px', textTransform: 'uppercase' }}>Objetivos del sistema</span>
                </div>
                {[
                  { letra: 'S', color: '#eab308', bg: 'rgba(234,179,8,0.15)', texto: 'Sistematizar variables críticas del ciclo de vida de producción aurífera' },
                  { letra: 'A', color: '#2dd4bf', bg: 'rgba(45,212,191,0.12)', texto: 'Automatizar el cálculo de costos unitarios y totales de producción' },
                  { letra: 'M', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', texto: 'Modelado predictivo de tendencias de mercado y escenarios financieros' },
                  { letra: 'G', color: '#4ade80', bg: 'rgba(74,222,128,0.12)', texto: 'Gobernanza: trazabilidad y formalización de cadena de suministro' },
                  { letra: 'V', color: '#fb923c', bg: 'rgba(251,146,60,0.12)', texto: 'Validación empírica mediante casos reales y simulaciones de alta fidelidad' },
                ].map((o) => (
                  <div key={o.letra} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '10px', textAlign: 'left' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '6px', background: o.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: o.color }}>{o.letra}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, margin: 0 }}>{o.texto}</p>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '28px' }}>
                {[{ num: '5', label: 'módulos activos' }, { num: '2026', label: 'versión actual' }, { num: '100%', label: 'trazabilidad' }].map((s) => (
                  <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '14px 12px', textAlign: 'center' }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 600, color: '#eab308', display: 'block' }}>{s.num}</span>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px', display: 'block' }}>{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Grid Layout de Módulos */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    onClick={() => setModuloActivo('Balance')}
                    style={{
                      background: 'rgba(234,179,8,0.05)',
                      border: '1px solid #eab308',
                      borderRadius: '16px',
                      padding: '16px 14px',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ color: '#eab308', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Balance ⭐</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Flujo, stock y metalurgia</div>
                  </button>
                  {[
                    { name: 'Transporte', desc: 'Logística de carga' },
                    { name: 'Ventas', desc: 'Comercialización' },
                    { name: 'Finanzas', desc: 'Costos y margen' }
                  ].map((mod) => (
                    <button
                      key={mod.name}
                      disabled
                      style={{
                        background: 'rgba(255,255,255,0.01)',
                        border: '1px solid rgba(255,255,255,0.04)',
                        borderRadius: '16px',
                        padding: '16px 14px',
                        textAlign: 'left',
                        cursor: 'not-allowed',
                        opacity: 0.3
                      }}
                    >
                      <div style={{ color: '#fff', fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>{mod.name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}>{mod.desc}</div>
                    </button>
                  ))}
                </div>

                <button
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #eab308, #ca8a04)',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '16px',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#0d1117',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 4px 12px rgba(234, 179, 8, 0.15)'
                  }}
                >
                  <span>Generar Reportes Globales</span>
                  <span>📊</span>
                </button>
              </div>
            </>
          ) : (

            // --- MÓDULO DE BALANCE METALÚRGICO ---
            <div>
              <div style={{ marginBottom: '20px' }}>
                <span style={{ color: '#eab308', textTransform: 'uppercase', fontSize: '11px', fontWeight: 600, letterSpacing: '1px' }}>Módulo Activo</span>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#fff', margin: '4px 0 10px' }}>
                  Auditoría de Balance Metalúrgico
                </h2>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                  Ingresa las guardias operativas manualmente o inyecta una matriz de datos histórica en formato .CSV
                </p>
              </div>

              {/* Mensajes de Status */}
              {mensajeStatus.texto && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  marginBottom: '20px',
                  background: mensajeStatus.tipo === 'success' ? 'rgba(74,222,128,0.1)' : mensajeStatus.tipo === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(234,179,8,0.1)',
                  border: `1px solid ${mensajeStatus.tipo === 'success' ? '#4ade80' : mensajeStatus.tipo === 'error' ? '#ef4444' : '#eab308'}`,
                  color: mensajeStatus.tipo === 'success' ? '#4ade80' : mensajeStatus.tipo === 'error' ? '#ef4444' : '#eab308'
                }}>
                  {mensajeStatus.texto}
                </div>
              )}

              {/* Panel de Doble Columna */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }}>

                {/* COLUMNA IZQUIERDA: Formulario */}
                <form onSubmit={handleGuardarManual} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Fecha de Guardia</label>
                      <input type="date" name="fecha" value={formData.fecha} onChange={handleInputChange} style={styles.input} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Turno</label>
                      <select name="turno" value={formData.turno} onChange={handleInputChange} style={styles.input}>
                        <option value="Mañana">Mañana</option>
                        <option value="Tarde">Tarde</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Mineral Húmedo (TMH)</label>
                      <input type="number" step="any" name="tmh_tratadas" value={formData.tmh_tratadas} onChange={handleInputChange} style={styles.inputGrid} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Humedad (%)</label>
                      <input type="number" step="any" name="humedad_porcentaje" value={formData.humedad_porcentaje} onChange={handleInputChange} style={styles.inputGrid} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Ley Cabeza (g/t)</label>
                      <input type="number" step="any" name="ley_cabeza_au" value={formData.ley_cabeza_au} onChange={handleInputChange} style={styles.inputGrid} />
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '11px', fontWeight: 500, color: '#eab308', display: 'block', marginBottom: '8px' }}>1. Concentración Espiral</span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <input type="number" step="any" name="espiral_ley_au" placeholder="Ley Au (g/t)" value={formData.espiral_ley_au} onChange={handleInputChange} style={styles.input} />
                      <input type="number" step="any" name="espiral_conc_tms_dia" placeholder="Peso Conc (TMS)" value={formData.espiral_conc_tms_dia} onChange={handleInputChange} style={styles.input} />
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '11px', fontWeight: 500, color: '#2dd4bf', display: 'block', marginBottom: '8px' }}>2. Concentración ICON 350</span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <input type="number" step="any" name="icon_ley_au" placeholder="Ley Au (g/t)" value={formData.icon_ley_au} onChange={handleInputChange} style={styles.input} />
                      <input type="number" step="any" name="icon_conc_tms_dia" placeholder="Peso Conc (TMS)" value={formData.icon_conc_tms_dia} onChange={handleInputChange} style={styles.input} />
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '11px', fontWeight: 500, color: '#a78bfa', display: 'block', marginBottom: '8px' }}>3. Circuito Flotación</span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <input type="number" step="any" name="flotacion_ley_au" placeholder="Ley Au (g/t)" value={formData.flotacion_ley_au} onChange={handleInputChange} style={styles.input} />
                      <input type="number" step="any" name="flotacion_conc_tms_dia" placeholder="Peso Conc (TMS)" value={formData.flotacion_conc_tms_dia} onChange={handleInputChange} style={styles.input} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Ley de Relave Final (g/TMS)</label>
                    <input type="number" step="any" name="ley_relave_au" value={formData.ley_relave_au} onChange={handleInputChange} style={styles.input} />
                  </div>

                  <button type="submit" style={styles.btnGold}>
                    ✓ Procesar y Guardar en Base de Datos
                  </button>

                  <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', marginTop: '10px', paddingTop: '15px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>📂 Carga Masiva Mensual (.CSV)</label>
                    <input type="file" accept=".csv" onChange={handleCargaMasivaCSV} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }} />
                  </div>
                </form>

                {/* COLUMNA DERECHA: Reporte Acumulado */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '20px', padding: '24px', minHeight: '500px' }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#fff', margin: '0 0 16px' }}>
                    🔬 Monitor Metalúrgico Activo
                  </h3>

                  {totalesConsolidados ? (
                    <div style={{ background: 'rgba(234,179,8,0.03)', border: '1px solid rgba(234,179,8,0.15)', borderRadius: '16px', padding: '16px', marginBottom: '20px', textAlign: 'left' }}>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '11px', color: '#eab308', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          📊 ACUMULADO POR PERIODO
                        </span>

                        <select
                          value={`${mesSeleccionado.anio}-${mesSeleccionado.mes}`}
                          onChange={(e) => {
                            const [anio, mes] = e.target.value.split('-');
                            setMesSeleccionado({ anio, mes });
                          }}
                          style={{
                            background: '#161b22',
                            border: '1px solid rgba(234,179,8,0.3)',
                            borderRadius: '6px',
                            color: '#eab308',
                            fontSize: '11px',
                            padding: '4px 8px',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="2024-04">Abril 2024 (Masivo)</option>
                          <option value="2024-05">Mayo 2024 (Pruebas)</option>
                        </select>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                        <div>
                          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>TMS Total Tratado</span>
                          <div style={{ color: '#fff', fontSize: '15px', fontWeight: 'bold' }}>{totalesConsolidados.tms} t</div>
                        </div>
                        <div>
                          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Fino Total Cabeza</span>
                          <div style={{ color: '#fff', fontSize: '15px', fontWeight: 'bold' }}>{totalesConsolidados.cabeza_gr} gr</div>
                        </div>
                      </div>

                      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '6px' }}>Contenido Fino Individual Total:</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', color: 'rgba(255,255,255,0.7)', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>• Total Espiral:</span> <strong style={{ color: '#eab308' }}>{totalesConsolidados.espiral_oz} Oz</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>• Total ICON 350:</span> <strong style={{ color: '#2dd4bf' }}>{totalesConsolidados.icon_oz} Oz</strong></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>• Total Flotación:</span> <strong style={{ color: '#a78bfa' }}>{totalesConsolidados.flotacion_oz} Oz</strong></div>
                      </div>

                      <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(234,179,8,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', fontWeight: 500 }}>Producción Total del Mes:</span>
                        <strong style={{ color: '#4ade80', fontSize: '14px' }}>{totalesConsolidados.total_gr} gr ({totalesConsolidados.total_oz} Oz)</strong>
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px', marginBottom: '20px', textAlign: 'left' }}>Cargando acumulados...</div>
                  )}

                  {/* ÚLTIMA ACCIÓN GUARDADA */}
                  {resultadosCalculados ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px', textAlign: 'left', color: 'rgba(255,255,255,0.8)', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '15px' }}>
                      <div>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>Última Guardia Procesada:</span>
                        <div style={{ fontWeight: 500, fontSize: '14px', color: '#eab308' }}>{resultadosCalculados.fecha_guardia} ({resultadosCalculados.turno})</div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '10px' }}>
                        <div>
                          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', display: 'block' }}>Molienda Seca (TMS)</span>
                          <strong style={{ color: '#fff', fontSize: '13px' }}>{resultadosCalculados.tms_tratadas} t</strong>
                        </div>
                        <div>
                          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', display: 'block' }}>Fino en Cabeza (gr)</span>
                          <strong style={{ color: '#fff', fontSize: '13px' }}>{resultadosCalculados.contenido_cabeza_gr} gr</strong>
                        </div>
                      </div>

                      <div style={{ borderLeft: '2px solid #eab308', paddingLeft: '10px', fontSize: '12px' }}>
                        <div style={{ fontWeight: 500, color: '#eab308' }}>Circuito Espiral</div>
                        <span>Ratio: <strong>{resultadosCalculados.ratio_espiral}</strong> | Fino: <strong>{resultadosCalculados.fino_espiral_oz} Oz</strong></span>
                      </div>

                      <div style={{ borderLeft: '2px solid #2dd4bf', paddingLeft: '10px', fontSize: '12px' }}>
                        <div style={{ fontWeight: 500, color: '#2dd4bf' }}>ICON 350</div>
                        <span>Ratio: <strong>{resultadosCalculados.ratio_icon}</strong> | Fino: <strong>{resultadosCalculados.fino_icon_oz} Oz</strong></span>
                      </div>

                      <div style={{ borderLeft: '2px solid #a78bfa', paddingLeft: '10px', fontSize: '12px' }}>
                        <div style={{ fontWeight: 500, color: '#a78bfa' }}>Flotación</div>
                        <span>Ratio: <strong>{resultadosCalculados.ratio_flotacion}</strong> | Fino: <strong>{resultadosCalculados.fino_flotacion_oz} Oz</strong></span>
                      </div>

                      <div style={{ marginTop: '5px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px', fontSize: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span>📈 Recup. Contenido:</span>
                          <strong style={{ color: '#4ade80' }}>{resultadosCalculados.recuperacion_contenido_porc}%</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>📉 Recup. Leyes:</span>
                          <strong style={{ color: '#2dd4bf' }}>{resultadosCalculados.recuperacion_leyes_porc}%</strong>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '180px', justifyContent: 'center', alignItems: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>
                      <span>Esperando ejecución matemática...</span>
                      <span style={{ fontSize: '24px', marginTop: '10px' }}>🧪</span>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>
            MineCost by LitoTech · Lima, 2026
          </p>

        </div>
      </div>
    </div>
  );
}

// --- ESTILOS EN LÍNEA OPTIMIZADOS ---
const styles = {
  input: {
    width: '100%',
    background: '#161b22',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '10px 12px',
    color: '#fff',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  inputGrid: {
    width: '100%',
    background: '#0d1117',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    padding: '8px',
    color: '#fff',
    fontSize: '12px',
    boxSizing: 'border-box',
    marginTop: '4px'
  },
  btnGold: {
    background: 'linear-gradient(135deg, #eab308, #ca8a04)',
    color: '#0d1117',
    border: 'none',
    borderRadius: '12px',
    padding: '14px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '10px',
    boxShadow: '0 4px 10px rgba(234,179,8,0.1)'
  }
};

export default App;
