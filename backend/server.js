import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Cargar variables de entorno ocultas (.env)
dotenv.config();

const app = express();

// 1. Middlewares Base (CORS y Lectura de JSON)
app.use(cors());
app.use(express.json());

// Ruta raíz para confirmar que el servidor está vivo
app.get('/', (req, res) => {
  res.send('<h1>Servidor Metalúrgico Activo</h1><p>Las APIs están operativas en /api/...</p>');
});

// 2. 🛡️ Escudo CSP - BORRA O COMENTA TODO ESTE BLOQUE
/*
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self' http://localhost:5000 http://localhost:5173 http://localhost:3000 ws://localhost:5173 http://localhost:5000/.well-known/appspecific/com.chrome.devtools.json; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;"
  );
  next();
});
*/

// 3. Inicializar el cliente de Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// 4. Configurar Multer para procesar el CSV directo en la memoria RAM
const upload = multer({ storage: multer.memoryStorage() });

const OZ_TROY_GR = 31.1035;

// 5. 🧮 FUNCIÓN CENTRAL: Clon exacto del motor matemático de tu script de Python
const calcularBalanceMetalurgico = (datos) => {
  // 1. Cálculos de Entrada (Cabeza)
  const tms = datos.tmh * (1 - (datos.humedad / 100));
  const contenido_cabeza_gr = tms * datos.ley_cabeza;

  // 2. Concentración en Espiral
  const ratio_espiral = datos.espiral_tms > 0 ? tms / datos.espiral_tms : 0;
  const contenido_espiral_oz = (datos.espiral_ley * datos.espiral_tms) / OZ_TROY_GR;

  // 3. Concentración en ICON 350
  const ratio_icon = datos.icon_tms > 0 ? tms / datos.icon_tms : 0;
  const contenido_icon_oz = (datos.icon_ley * datos.icon_tms) / OZ_TROY_GR;

  // 4. Concentración por Flotación
  const ratio_flotacion = datos.flotacion_tms > 0 ? tms / datos.flotacion_tms : 0;
  const contenido_flotacion_oz = (datos.flotacion_ley * datos.flotacion_tms) / OZ_TROY_GR;

  // 5. Producción Diaria y Relave
  const produccion_diaria_gr = (contenido_espiral_oz + contenido_icon_oz + contenido_flotacion_oz) * OZ_TROY_GR;

  // 6. Recuperación Diaria (%)
  const recuperacion_por_contenido = contenido_cabeza_gr > 0 ? (produccion_diaria_gr / contenido_cabeza_gr) * 100 : 0;
  const recuperacion_por_leyes = datos.ley_cabeza > 0 ? ((datos.ley_cabeza - datos.ley_relave) / datos.ley_cabeza) * 100 : 0;

  return {
    tms_tratadas: parseFloat(tms.toFixed(4)),
    contenido_cabeza_gr: parseFloat(contenido_cabeza_gr.toFixed(4)),
    ratio_espiral: parseFloat(ratio_espiral.toFixed(2)),
    fino_espiral_oz: parseFloat(contenido_espiral_oz.toFixed(4)),
    ratio_icon: parseFloat(ratio_icon.toFixed(2)),
    fino_icon_oz: parseFloat(contenido_icon_oz.toFixed(4)),
    ratio_flotacion: parseFloat(ratio_flotacion.toFixed(2)),
    fino_flotacion_oz: parseFloat(contenido_flotacion_oz.toFixed(4)),
    produccion_total_gr: parseFloat(produccion_diaria_gr.toFixed(4)),
    recuperacion_contenido_porc: parseFloat(recuperacion_por_contenido.toFixed(2)),
    recuperacion_leyes_porc: parseFloat(recuperacion_por_leyes.toFixed(2))
  };
};

// ==========================================
// RUTA 1: Registro Manual (Turno Unitario)
// ==========================================
app.post('/api/guardar-manual', async (req, res) => {
  try {
    const datosManuales = req.body;
    
    const calculos = calcularBalanceMetalurgico({
      tmh: datosManuales.tmh_tratadas, 
      humedad: datosManuales.humedad_porcentaje, 
      ley_cabeza: datosManuales.ley_cabeza_au,
      espiral_ley: datosManuales.espiral_ley_au, 
      espiral_tms: datosManuales.espiral_conc_tms_dia,
      icon_ley: datosManuales.icon_ley_au, 
      icon_tms: datosManuales.icon_conc_tms_dia,
      flotacion_ley: datosManuales.flotacion_ley_au, 
      flotacion_tms: datosManuales.flotacion_conc_tms_dia,
      ley_relave: datosManuales.ley_relave_au
    });

    const registroFinal = {
      fecha_guardia: datosManuales.fecha,
      turno: datosManuales.turno,
      tmh_tratadas: datosManuales.tmh_tratadas,
      humedad_porcentaje: datosManuales.humedad_porcentaje,
      ley_cabeza_au: datosManuales.ley_cabeza_au,
      ley_relave_au: datosManuales.ley_relave_au,
      ...calculos
    };

    const { error } = await supabase.from('balance_metalurgico').insert([registroFinal]);
    if (error) throw error;

    res.status(200).json({ 
      message: '✓ Turno manual calculado y guardado en Supabase con éxito.',
      resultados: registroFinal
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// RUTA 2: Carga Masiva (Procesamiento desde CSV)
// ==========================================
app.post('/api/cargar-masivo-csv', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se envió ningún archivo.' });

    let csvText = req.file.buffer.toString('utf-8');
    
    if (csvText.startsWith('\uFEFF')) {
      csvText = csvText.slice(1);
    }

    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
    const rowsCalculadas = [];

    console.log(`\n⚙️ Procesando archivo... Detectadas ${lines.length} líneas.`);

    for (let i = 1; i < lines.length; i++) {
      const v = lines[i].split(';'); 
      
      if (v.length < 12 || !v[0]) continue; 

      const variablesEntrada = {
        dia: v[0].replace(/[^0-9]/g, '').trim(),
        turno: v[1].trim(),
        tmh: parseFloat(v[2]) || 0,
        humedad: parseFloat(v[3]) || 0,
        ley_cabeza: parseFloat(v[4]) || 0,
        espiral_ley: parseFloat(v[5]) || 0, 
        espiral_tms: parseFloat(v[6]) || 0, 
        icon_ley: parseFloat(v[7]) || 0,
        icon_tms: parseFloat(v[8]) || 0,
        flotacion_ley: parseFloat(v[9]) || 0,
        flotacion_tms: parseFloat(v[10]) || 0,
        ley_relave: parseFloat(v[11]) || 0
      };

      const calculos = calcularBalanceMetalurgico(variablesEntrada);

      rowsCalculadas.push({
        fecha_guardia: `2024-04-${variablesEntrada.dia.padStart(2, '0')}`,
        turno: variablesEntrada.turno,
        tmh_tratadas: variablesEntrada.tmh,
        humedad_porcentaje: variablesEntrada.humedad,
        ley_cabeza_au: variablesEntrada.ley_cabeza,
        ley_relave_au: variablesEntrada.ley_relave,
        ...calculos
      });
    }

    console.log(`🚀 Intentando inyectar ${rowsCalculadas.length} filas calculadas en Supabase...`);

    const { error } = await supabase.from('balance_metalurgico').insert(rowsCalculadas);
    if (error) throw error;

    console.log(`✅ ¡Inserción masiva completada con éxito en la Base de Datos!\n`);
    res.status(200).json({ 
      message: `¡Éxito absoluto! Se procesaron y guardaron ${rowsCalculadas.length} turnos en Supabase.`,
      data: rowsCalculadas
    });

  } catch (err) {
    console.error("\n💥 Error interno detectado en el Servidor:", err.message);
    res.status(500).json({ error: `Error interno en el servidor: ${err.message}` });
  }
});

// ==========================================
// RUTA 3: Obtener Totales Consolidados FILTRADOS POR MES - OPTIMIZADA
// ==========================================
app.get('/api/totales-balance/:anio/:mes', async (req, res) => {
  try {
    const { anio, mes } = req.params;
    
    const numMes = parseInt(mes, 10);
    const numAnio = parseInt(anio, 10);

    const primerDia = `${anio}-${mes.padStart(2, '0')}-01`;
    
    const proxMes = numMes === 12 ? 1 : numMes + 1;
    const proxAnio = numMes === 12 ? numAnio + 1 : numAnio;
    const primerDiaProxMes = `${proxAnio}-${String(proxMes).padStart(2, '0')}-01`;

    const { data, error } = await supabase
      .from('balance_metalurgico')
      .select('tms_tratadas, contenido_cabeza_gr, fino_espiral_oz, fino_icon_oz, fino_flotacion_oz, produccion_total_gr')
      .gte('fecha_guardia', primerDia)
      .lt('fecha_guardia', primerDiaProxMes);

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(200).json({ tms: 0, cabeza_gr: 0, espiral_oz: 0, icon_oz: 0, flotacion_oz: 0, total_gr: 0, total_oz: 0 });
    }

    const totales = data.reduce((acc, row) => {
      acc.tms += parseFloat(row.tms_tratadas) || 0;
      acc.cabeza_gr += parseFloat(row.contenido_cabeza_gr) || 0;
      acc.espiral_oz += parseFloat(row.fino_espiral_oz) || 0;
      acc.icon_oz += parseFloat(row.fino_icon_oz) || 0;
      acc.flotacion_oz += parseFloat(row.fino_flotacion_oz) || 0;
      acc.total_gr += parseFloat(row.produccion_total_gr) || 0;
      return acc;
    }, { tms: 0, cabeza_gr: 0, espiral_oz: 0, icon_oz: 0, flotacion_oz: 0, total_gr: 0 });

    res.status(200).json({
      tms: parseFloat(totales.tms.toFixed(4)),
      cabeza_gr: parseFloat(totales.cabeza_gr.toFixed(4)),
      espiral_oz: parseFloat(totales.espiral_oz.toFixed(4)),
      icon_oz: parseFloat(totales.icon_oz.toFixed(4)),
      flotacion_oz: parseFloat(totales.flotacion_oz.toFixed(4)),
      total_gr: parseFloat(totales.total_gr.toFixed(4)),
      total_oz: parseFloat((totales.total_gr / 31.1035).toFixed(4))
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// Encendido del servidor (SIEMPRE AL FINAL)
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Servidor metalúrgico activo de forma segura`);
  console.log(`🔌 Escuchando peticiones en: http://localhost:${PORT}`);
  console.log(`==================================================\n`);
});