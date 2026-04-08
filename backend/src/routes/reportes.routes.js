const express = require('express');
const router = express.Router();
const ReportesController = require('../controllers/reportes.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.get('/usuario/caja', authenticate, authorize(['COMPLEJO']), ReportesController.reporteUsuario);
router.get('/admin', authenticate, authorize(['ADMIN']), ReportesController.reporteAdmin);
router.get('/ventas-producto', authenticate, authorize(['ADMIN']), ReportesController.reporteVentasProducto);

module.exports = router;
