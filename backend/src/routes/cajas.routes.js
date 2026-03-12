const express = require('express');
const router = express.Router();
const CajasController = require('../controllers/cajas.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.post('/abrir', authenticate, authorize(['COMPLEJO', 'ADMIN']), CajasController.abrirCaja);
router.post('/:id/cerrar', authenticate, authorize(['COMPLEJO', 'ADMIN']), CajasController.cerrarCaja);
router.get('/active', authenticate, CajasController.getActive);
router.get('/', authenticate, CajasController.getAll);
router.get('/:id', authenticate, CajasController.getById);

module.exports = router;
