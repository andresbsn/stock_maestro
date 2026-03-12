const express = require('express');
const router = express.Router();
const GastosController = require('../controllers/gastos.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.get('/', authenticate, authorize(['ADMIN']), GastosController.getAll);
router.post('/', authenticate, authorize(['ADMIN']), GastosController.createGasto);

module.exports = router;
