const GastosService = require('../services/gastos.service');

exports.getAll = async (req, res) => {
    try {
        const filters = { ...req.query };
        const gastos = await GastosService.getAll(filters);
        res.json({ ok: true, data: gastos });
    } catch (error) {
        res.status(500).json({ ok: false, error: { message: error.message } });
    }
};

exports.createGasto = async (req, res) => {
    try {
        const gasto = await GastosService.createGasto(req.body, req.user);
        res.json({ ok: true, data: gasto });
    } catch (error) {
        res.status(400).json({ ok: false, error: { message: error.message } });
    }
};
