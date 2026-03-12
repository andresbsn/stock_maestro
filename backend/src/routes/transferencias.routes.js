const express = require('express');
const router = express.Router();
const TransferenciasController = require('../controllers/transferencias.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.get('/ordenes', authenticate, TransferenciasController.getAll);
router.post('/ordenes', authenticate, authorize(['ADMIN']), TransferenciasController.createOrden);
router.post('/ordenes/:id/confirmar', authenticate, authorize(['ADMIN', 'COMPLEJO']), TransferenciasController.confirmarOrden);
router.put('/ordenes/:id', authenticate, authorize(['ADMIN']), TransferenciasController.updateOrden);
router.delete('/ordenes/:id', authenticate, authorize(['ADMIN']), TransferenciasController.deleteOrden);

module.exports = router;
