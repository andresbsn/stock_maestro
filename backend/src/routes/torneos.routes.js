const express = require('express');
const router = express.Router();
const TorneosController = require('../controllers/torneos.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.get('/', authenticate, TorneosController.getAll);
router.get('/active', authenticate, TorneosController.getActive);
router.post('/', authenticate, authorize(['ADMIN']), TorneosController.create);
router.put('/:id', authenticate, authorize(['ADMIN']), TorneosController.update);
router.delete('/:id', authenticate, authorize(['ADMIN']), TorneosController.delete);

module.exports = router;
