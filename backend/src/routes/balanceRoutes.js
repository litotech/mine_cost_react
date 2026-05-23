// Rutas de la API (POST /guardar, GET /mensual)

import express from 'express';
import { guardarBalance, obtenerTotalesMensuales } from '../controllers/balanceController.js';

const router = express.Router();

// Ruta para guardar un turno o lote CSV
router.post('/guardar', guardarBalance);

// Ruta para obtener los totales mensuales acumulados
router.get('/totales-mensuales', obtenerTotalesMensuales);

export default router;