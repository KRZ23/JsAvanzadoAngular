const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Servir archivos estáticos del frontend (html, js, imágenes)
app.use(express.static('frontend'));

// Rutas API
const productosRoutes = require('./routes/api.productos');
app.use('/api/productos', productosRoutes);

const carritoRoutes = require('./routes/api.carrito');
app.use('/api/carrito', carritoRoutes);

const formularioPagoRoutes = require('./routes/api.formulario');
app.use('/api/formulario', formularioPagoRoutes);

const estructuraFormularioRoutes = require('./routes/api.formulario-estructura');
app.use('/api/estructura-formulario', estructuraFormularioRoutes);





// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
