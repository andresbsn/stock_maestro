const ComprasService = require('../services/compras.service');

exports.getAll = async (req, res) => {
    try {
        const notas = await ComprasService.getAll();
        res.json({ ok: true, data: notas });
    } catch (error) {
        res.status(500).json({ ok: false, error: { message: error.message } });
    }
};

exports.createNota = async (req, res) => {
    try {
        const nota = await ComprasService.createNotaCompra(req.body, req.user);
        res.json({ ok: true, data: nota });
    } catch (error) {
        res.status(400).json({ ok: false, error: { message: error.message } });
    }
};
