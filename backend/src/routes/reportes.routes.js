const express = require('express');
const router = express.Router();
const ReportesController = require('../controllers/reportes.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.get('/usuario/caja', authenticate, authorize(['COMPLEJO']), ReportesController.reporteUsuario);
router.get('/admin', authenticate, authorize(['ADMIN']), ReportesController.reporteAdmin);

module.exports = router;
