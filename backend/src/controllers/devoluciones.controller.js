const DevolucionesService = require('../services/devoluciones.service');

exports.getAll = async (req, res) => {
    try {
        const filters = { ...req.query };
        const devoluciones = await DevolucionesService.getAll(filters);
        res.json({ ok: true, data: devoluciones });
    } catch (error) {
        res.status(500).json({ ok: false, error: { message: error.message } });
    }
};

exports.createDevolucion = async (req, res) => {
    try {
        const devolucion = await DevolucionesService.createDevolucion(req.body, req.user);
        res.json({ ok: true, data: devolucion });
    } catch (error) {
        res.status(400).json({ ok: false, error: { message: error.message } });
    }
};
