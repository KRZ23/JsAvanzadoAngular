const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

const ARCHIVO = path.join(__dirname, '..', '..', 'frontend', 'db-carrito.json');


// Asegura que el archivo exista y esté bien formado
function asegurarArchivo() {
  if (!fs.existsSync(ARCHIVO)) {
    fs.writeFileSync(ARCHIVO, '[]');
  } else {
    try {
      const data = fs.readFileSync(ARCHIVO, 'utf8');
      JSON.parse(data); // Validar JSON
    } catch (e) {
      fs.writeFileSync(ARCHIVO, '[]'); // Si está corrupto, se reinicia
    }
  }
}

// GET /api/carrito
router.get('/', (req, res) => {
  asegurarArchivo();
  const data = fs.readFileSync(ARCHIVO, 'utf8');
  res.json(JSON.parse(data));
});

// POST /api/carrito
router.post('/', (req, res) => {
  try {
    asegurarArchivo();
    const nuevoProducto = req.body;

    // Validar datos
    if (!nuevoProducto.nombre || !nuevoProducto.precio || !nuevoProducto.imagen) {
      console.log("❌ Datos faltantes:", nuevoProducto);
      return res.status(400).send('Faltan campos obligatorios');
    }

    let carrito = JSON.parse(fs.readFileSync(ARCHIVO, 'utf8'));

    // Generar ID único
    const nuevoId = carrito.length > 0 ? Math.max(...carrito.map(p => p.id || 0)) + 1 : 1;
    nuevoProducto.id = nuevoId;

    carrito.push(nuevoProducto);
    fs.writeFileSync(ARCHIVO, JSON.stringify(carrito, null, 2));

    console.log("✅ Producto agregado:", nuevoProducto);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error("💥 Error interno:", error.message);
    res.status(500).send("Error interno del servidor: " + error.message);
  }
});

// DELETE /api/carrito/:id
router.delete('/:id', (req, res) => {
  asegurarArchivo();
  const id = parseInt(req.params.id);
  let carrito = JSON.parse(fs.readFileSync(ARCHIVO, 'utf8'));

  const index = carrito.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).send('Producto no encontrado');
  }

  carrito.splice(index, 1);
  fs.writeFileSync(ARCHIVO, JSON.stringify(carrito, null, 2));
  res.sendStatus(200);
});

// Vaciar carrito
router.delete('/vaciar', (req, res) => {
  fs.writeFile(DB_PATH, '[]', (err) => {
    if (err) return res.status(500).json({ error: 'No se pudo vaciar el carrito' });
    res.json({ mensaje: 'Carrito vaciado correctamente' });
  });
});


module.exports = router;
