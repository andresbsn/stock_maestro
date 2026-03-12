const CajasService = require('../services/cajas.service');

exports.abrirCaja = async (req, res) => {
    try {
        const { torneoId, complejoId, montoInicial } = req.body;
        const caja = await CajasService.abrirCaja(torneoId, complejoId, montoInicial, req.user);
        res.json({ ok: true, data: caja });
    } catch (error) {
        res.status(400).json({ ok: false, error: { message: error.message } });
    }
};

exports.cerrarCaja = async (req, res) => {
    try {
        const { montoFinal } = req.body;
        const caja = await CajasService.cerrarCaja(req.params.id, montoFinal, req.user);
        res.json({ ok: true, data: caja });
    } catch (error) {
        res.status(400).json({ ok: false, error: { message: error.message } });
    }
};

exports.getActive = async (req, res) => {
    try {
        const { complejoId, torneoId } = req.query;
        // For now, if no params, maybe just return any open by user logic or null.
        // Assuming we want to check for a specific context.
        const caja = await CajasService.getActive(complejoId || null, torneoId || null);
        res.json({ ok: true, data: caja });
    } catch (error) {
        res.status(500).json({ ok: false, error: { message: error.message } });
    }
};

exports.getAll = async (req, res) => {
    try {
        const cajas = await CajasService.getAll();
        res.json({ ok: true, data: cajas });
    } catch (error) {
        res.status(500).json({ ok: false, error: { message: error.message } });
    }
};

exports.getById = async (req, res) => {
    try {
        const caja = await CajasService.getById(req.params.id);
        res.json({ ok: true, data: caja });
    } catch (error) {
        res.status(404).json({ ok: false, error: { message: error.message } });
    }
};
