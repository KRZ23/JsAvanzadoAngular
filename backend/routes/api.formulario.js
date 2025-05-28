const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const ruta = path.join(__dirname, '../../frontend/db-formulario.json');

router.post('/guardar', (req, res) => {
  const nuevaEntrada = req.body;

  fs.readFile(ruta, 'utf8', (err, data) => {
    let formularios = [];

    if (!err && data) {
      formularios = JSON.parse(data);
    }

    formularios.push(nuevaEntrada);

    fs.writeFile(ruta, JSON.stringify(formularios, null, 2), err => {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al guardar' });
      }
      res.status(200).json({ mensaje: 'Guardado correctamente' });
    });
  });
});

module.exports = router;
