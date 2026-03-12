const express = require('express');
const router = express.Router();
const ProductosController = require('../controllers/productos.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.get('/', authenticate, ProductosController.getAll);
router.post('/', authenticate, authorize(['ADMIN']), ProductosController.create);
router.put('/:id', authenticate, authorize(['ADMIN']), ProductosController.update);

module.exports = router;
