const express = require('express');
const router = express.Router();
const DevolucionesController = require('../controllers/devoluciones.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.get('/', authenticate, authorize(['ADMIN']), DevolucionesController.getAll);
router.post('/', authenticate, authorize(['ADMIN']), DevolucionesController.createDevolucion);

module.exports = router;
