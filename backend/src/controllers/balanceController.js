// Lógica para guardar y calcular totales mensuales

import { supabase } from '../config/supabase.js';

const OZ_TROY_GR = 31.1035;

// Función auxiliar para realizar los cálculos metalúrgicos
const calcularMetricas = (fila) => {
  const tmh = parseFloat(fila.tmh_tratadas) || 0;
  const humedad = parseFloat(fila.humedad_porcentaje) || 0;
  const ley_cabeza = parseFloat(fila.ley_cabeza_au) || 0;
  const espiral_ley = parseFloat(fila.espiral_ley_au) || 0;
  const espiral_conc = parseFloat(fila.espiral_conc_tms_dia) || 0;
  const icon_ley = parseFloat(fila.icon_ley_au) || 0;
  const icon_conc = parseFloat(fila.icon_conc_tms_dia) || 0;
  const flotacion_ley = parseFloat(fila.flotacion_ley_au) || 0;
  const flotacion_conc = parseFloat(fila.flotacion_conc_tms_dia) || 0;
  const ley_relave = parseFloat(fila.ley_relave_au) || 0;

  const tms = tmh * (1 - (humedad / 100));
  const cabeza_gr = tms * ley_cabeza;

  const espiral_ratio = espiral_conc > 0 ? tms / espiral_conc : 0;
  const espiral_oz = (espiral_ley * espiral_conc) / OZ_TROY_GR;

  const icon_ratio = icon_conc > 0 ? tms / icon_conc : 0;
  const icon_oz = (icon_ley * icon_conc) / OZ_TROY_GR;

  const flotacion_ratio = flotacion_conc > 0 ? tms / flotacion_conc : 0;
  const flotacion_oz = (flotacion_ley * flotacion_conc) / OZ_TROY_GR;

  const prod_gr = (espiral_oz + icon_oz + flotacion_oz) * OZ_TROY_GR;
  const prod_oz = prod_gr / OZ_TROY_GR;

  const rec_contenido = cabeza_gr > 0 ? (prod_gr / cabeza_gr) * 100 : 0;
  const rec_leyes = ley_cabeza > 0 ? ((ley_cabeza - ley_relave) / ley_cabeza) * 100 : 0;

  return {
    fecha: fila.fecha,
    turno: fila.turno,
    tmh_tratadas: tmh,
    humedad_porcentaje: humedad,
    tms_tratadas: tms,
    ley_cabeza_au: ley_cabeza,
    contenido_cabeza_gr: cabeza_gr,
    espiral_ley_au: espiral_ley,
    espiral_conc_tms_dia: espiral_conc,
    espiral_ratio,
    espiral_contenido_oz: espiral_oz,
    icon_ley_au: icon_ley,
    icon_conc_tms_dia: icon_conc,
    icon_ratio,
    icon_contenido_oz: icon_oz,
    flotacion_ley_au: flotacion_ley,
    flotacion_conc_tms_dia: flotacion_conc,
    flotacion_ratio,
    flotacion_contenido_oz: flotacion_oz,
    ley_relave_au: ley_relave,
    produccion_diaria_gr: prod_gr,
    produccion_diaria_oz: prod_oz,
    recuperacion_contenido: rec_contenido,
    recuperacion_leyes: rec_leyes
  };
};

// 1. Guardar registro(s) - Soporta inserción unitaria o masiva (lote de un mes)
export const guardarBalance = async (req, res) => {
  try {
    const datosRecibidos = req.body; 
    let registrosAInsertar = [];

    if (Array.isArray(datosRecibidos)) {
      // Si viene del CSV (un mes completo)
      registrosAInsertar = datosRecibidos.map(fila => calcularMetricas(fila));
    } else {
      // Si viene del formulario diario (un solo turno)
      registrosAInsertar.push(calcularMetricas(datosRecibidos));
    }

    const { data, error } = await supabase
      .from('balances_metalurgicos')
      .insert(registrosAInsertar);

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Error: Fecha y turno ya registrados previamente.' });
      }
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ mensaje: 'Datos procesados y guardados con éxito', data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// 2. Obtener Totales Mensuales directamente desde la Vista SQL de Supabase
export const obtenerTotalesMensuales = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('totales_mensuales_metalurgica') // Nombre de la vista SQL
      .select('*');

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};