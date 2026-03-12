const TorneosService = require('../services/torneos.service');

exports.getAll = async (req, res) => {
    console.log('[TorneosController] GET ALL request received');
    try {
        const torneos = await TorneosService.getAll();
        console.log(`[TorneosController] Found ${torneos.length} torneos`);
        res.json({ ok: true, data: torneos });
    } catch (error) {
        console.error("Torneos.getAll failed:", error);
        res.status(500).json({ ok: false, error: { message: error.message } });
    }
};

exports.getActive = async (req, res) => {
    try {
        const torneos = await TorneosService.getActive();
        res.json({ ok: true, data: torneos });
    } catch (error) {
        res.status(500).json({ ok: false, error: { message: error.message } });
    }
};

exports.create = async (req, res) => {
    try {
        const torneo = await TorneosService.create(req.body);
        res.json({ ok: true, data: torneo });
    } catch (error) {
        res.status(400).json({ ok: false, error: { message: error.message } });
    }
};

exports.update = async (req, res) => {
    try {
        const torneo = await TorneosService.update(req.params.id, req.body);
        res.json({ ok: true, data: torneo });
    } catch (error) {
        res.status(400).json({ ok: false, error: { message: error.message } });
    }
};

exports.delete = async (req, res) => {
    console.log('[TorneosController] DELETE request received for ID:', req.params.id);
    console.log('[TorneosController] User:', req.user);
    try {
        await TorneosService.delete(req.params.id);
        console.log('[TorneosController] Delete successful');
        res.json({ ok: true, message: 'Torneo eliminado' });
    } catch (error) {
        console.error('[TorneosController] Delete failed:', error);
        res.status(400).json({ ok: false, error: { message: error.message } });
    }
};
