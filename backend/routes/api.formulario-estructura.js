const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const DB_PATH = path.join(__dirname, "../../frontend/db-formulario-estructura.json");

// GET: obtener estructura
router.get("/", (req, res) => {
  fs.readFile(DB_PATH, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "No se pudo leer" });
    res.json(JSON.parse(data));
  });
});

// POST: agregar campo
router.post("/agregar", (req, res) => {
  const { clave, etiqueta } = req.body;
  fs.readFile(DB_PATH, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Error al leer" });

    let estructura = JSON.parse(data);
    const yaExiste = estructura.some(campo => campo.clave === clave);
    if (yaExiste) return res.status(400).json({ error: "Campo ya existe" });

    estructura.push({ clave, etiqueta });

    fs.writeFile(DB_PATH, JSON.stringify(estructura, null, 2), err => {
      if (err) return res.status(500).json({ error: "Error al guardar" });
      res.json({ mensaje: "Campo agregado" });
    });
  });
});

// PUT: editar campo
router.put("/editar/:clave", (req, res) => {
  const { clave } = req.params;
  const { nuevaClave, nuevaEtiqueta } = req.body;

  fs.readFile(DB_PATH, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Error al leer" });

    let estructura = JSON.parse(data);
    const index = estructura.findIndex(c => c.clave === clave);
    if (index === -1) return res.status(404).json({ error: "Campo no encontrado" });

    estructura[index].clave = nuevaClave || estructura[index].clave;
    estructura[index].etiqueta = nuevaEtiqueta || estructura[index].etiqueta;

    fs.writeFile(DB_PATH, JSON.stringify(estructura, null, 2), err => {
      if (err) return res.status(500).json({ error: "Error al guardar" });
      res.json({ mensaje: "Campo actualizado" });
    });
  });
});

// DELETE: eliminar campo
router.delete("/eliminar/:clave", (req, res) => {
  const { clave } = req.params;

  fs.readFile(DB_PATH, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Error al leer" });

    let estructura = JSON.parse(data);
    const nueva = estructura.filter(c => c.clave !== clave);

    if (nueva.length === estructura.length) {
      return res.status(404).json({ error: "Campo no existe" });
    }

    fs.writeFile(DB_PATH, JSON.stringify(nueva, null, 2), err => {
      if (err) return res.status(500).json({ error: "Error al guardar" });
      res.json({ mensaje: "Campo eliminado" });
    });
  });
});

module.exports = router;
