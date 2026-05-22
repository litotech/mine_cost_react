function App() {
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
        maxWidth: '480px',
        background: '#0d1117',
        minHeight: '700px',
        borderRadius: '32px',
        overflow: 'hidden',
        position: 'relative',
        border: '1px solid rgba(255,255,255,0.05)'
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

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
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

          {/* Título Actualizado */}
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

          {/* Sección de Nuevos Botones de Módulos (Grid Layout) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
            
            {/* Los 4 primeros en cuadrícula 2x2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { name: 'Balance', desc: 'Flujo y stock' },
                { name: 'Transporte', desc: 'Logística de carga' },
                { name: 'Ventas', desc: 'Comercialización' },
                { name: 'Finanzas', desc: 'Costos y margen' }
              ].map((mod) => (
                <button 
                  key={mod.name} 
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    padding: '16px 14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ color: '#eab308', fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>{mod.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}>{mod.desc}</div>
                </button>
              ))}
            </div>

            {/* Botón de Reportes destacado al ancho completo */}
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

          <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>
            MineCost by LitoTech · Lima, 2026
          </p>

        </div>
      </div>
    </div>
  );
}

export default App;