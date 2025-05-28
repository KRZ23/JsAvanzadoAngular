const express = require('express');
const router = express.Router();
const ofertasController = require('../controllers/ofertasController');

router.get('/', ofertasController.getOfertas);
router.post('/', ofertasController.addOferta);
router.put('/:id', ofertasController.updateOferta);
router.delete('/:id', ofertasController.deleteOferta);

module.exports = router;
