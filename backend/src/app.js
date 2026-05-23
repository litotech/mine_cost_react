// Archivo de entrada de Node.js/Express

import express from 'express';
import cors from 'cors';
import balanceRoutes from './routes/balanceRoutes.js';

const app = express();

app.use(cors());
app.use(express.json()); // Permite recibir JSON extensos (como los del mes completo)

// Prefijo para tus endpoints de metalurgia
app.use('/api/balances', balanceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor de la mina corriendo en el puerto ${PORT}`);
});