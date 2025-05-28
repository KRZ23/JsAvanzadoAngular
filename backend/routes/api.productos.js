const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const DB_PATH = path.join(__dirname, '../../frontend/db-productos.json');

// Obtener todos los productos
router.get('/', (req, res) => {
  fs.readFile(DB_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'No se pudo leer el archivo' });
    res.json(JSON.parse(data));
  });
});

// Agregar producto SIN repetir ID
router.post('/', (req, res) => {
  fs.readFile(DB_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'No se pudo leer el archivo' });

    const productos = JSON.parse(data);
    const existe = productos.find(p => p.id === req.body.id);

    if (existe) {
      return res.status(400).json({ error: 'Ya existe un producto con ese ID' });
    }

    productos.push(req.body);

    fs.writeFile(DB_PATH, JSON.stringify(productos, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'No se pudo escribir en el archivo' });
      res.json({ mensaje: 'Producto agregado exitosamente' });
    });
  });
});


// Eliminar producto por id
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile(DB_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'No se pudo leer el archivo' });

    let productos = JSON.parse(data);
    const nuevoArray = productos.filter(p => p.id !== id);

    if (productos.length === nuevoArray.length) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    fs.writeFile(DB_PATH, JSON.stringify(nuevoArray, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'No se pudo escribir el archivo' });
      res.json({ mensaje: 'Producto eliminado correctamente' });
    });
  });
});

// Actualizar producto por id
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const nuevoProducto = req.body;

  fs.readFile(DB_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'No se pudo leer el archivo' });

    let productos = JSON.parse(data);
    const index = productos.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    productos[index] = { ...nuevoProducto, id };

    fs.writeFile(DB_PATH, JSON.stringify(productos, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'No se pudo escribir el archivo' });
      res.json({ mensaje: 'Producto actualizado correctamente' });
    });
  });
});



module.exports = router;
