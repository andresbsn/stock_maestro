const VentasService = require('../services/ventas.service');

exports.getAll = async (req, res) => {
    try {
        const filters = { ...req.query };
        if (req.user.role === 'COMPLEJO') {
            filters.complejo_id = req.user.complejo_id;
        }
        const ventas = await VentasService.getAll(filters);
        res.json({ ok: true, data: ventas });
    } catch (error) {
        res.status(500).json({ ok: false, error: { message: error.message } });
    }
};

exports.createVenta = async (req, res) => {
    try {
        const venta = await VentasService.createVenta(req.body, req.user);
        res.json({ ok: true, data: venta });
    } catch (error) {
        res.status(400).json({ ok: false, error: { message: error.message } });
    }
};
