const express = require('express');
const router = express.Router();
const VentasController = require('../controllers/ventas.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.get('/', authenticate, VentasController.getAll);
router.post('/', authenticate, authorize(['COMPLEJO', 'ADMIN']), VentasController.createVenta);

module.exports = router;
