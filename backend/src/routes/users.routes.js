const express = require('express');
const router = express.Router();
const controller = require('../controllers/users.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.get('/', authenticate, authorize(['ADMIN']), controller.getAll);
router.post('/', authenticate, authorize(['ADMIN']), controller.create);
router.put('/:id', authenticate, authorize(['ADMIN']), controller.update);
router.delete('/:id', authenticate, authorize(['ADMIN']), controller.delete);

module.exports = router;
