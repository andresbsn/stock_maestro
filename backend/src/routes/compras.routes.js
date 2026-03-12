const express = require('express');
const router = express.Router();
const ComprasController = require('../controllers/compras.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.get('/notas', authenticate, ComprasController.getAll);
router.post('/notas', authenticate, authorize(['ADMIN']), ComprasController.createNota);

module.exports = router;
