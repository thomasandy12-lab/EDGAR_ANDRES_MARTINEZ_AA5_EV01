const express = require('express');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 3000;

// Permite recibir solicitudes con cuerpo en formato JSON.
app.use(express.json());

// Ruta simple para verificar que el servicio está disponible.
app.get('/api/health', (request, response) => {
  response.status(200).json({
    ok: true,
    mensaje: 'Servicio de autenticación disponible'
  });
});

// Rutas del caso: registro e inicio de sesión.
app.use('/api/auth', authRoutes);

// Manejo centralizado de errores no controlados.
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servicio disponible en http://localhost:${port}`);
});
