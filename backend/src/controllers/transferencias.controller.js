const TransferenciasService = require('../services/transferencias.service');

exports.getAll = async (req, res) => {
    try {
        const filters = {};
        if (req.user.role === 'COMPLEJO') {
            filters.complejo_id = req.user.complejo_id;
        }
        const ordenes = await TransferenciasService.getAll(filters);
        res.json({ ok: true, data: ordenes });
    } catch (error) {
        res.status(500).json({ ok: false, error: { message: error.message } });
    }
};

exports.createOrden = async (req, res) => {
    try {
        const orden = await TransferenciasService.createOrden(req.body, req.user);
        res.json({ ok: true, data: orden });
    } catch (error) {
        res.status(400).json({ ok: false, error: { message: error.message } });
    }
};

exports.confirmarOrden = async (req, res) => {
    try {
        const orden = await TransferenciasService.confirmarOrden(req.params.id, req.user);
        res.json({ ok: true, data: orden });
    } catch (error) {
        res.status(400).json({ ok: false, error: { message: error.message } });
    }
};

exports.updateOrden = async (req, res) => {
    try {
        const orden = await TransferenciasService.updateOrden(req.params.id, req.body);
        res.json({ ok: true, data: orden });
    } catch (error) {
        res.status(400).json({ ok: false, error: { message: error.message } });
    }
};

exports.deleteOrden = async (req, res) => {
    console.log('[Transferencias] DELETE request received for ID:', req.params.id);
    try {
        await TransferenciasService.deleteOrden(req.params.id);
        console.log('[Transferencias] DELETE successful');
        res.json({ ok: true, message: 'Orden eliminada' });
    } catch (error) {
        console.error('[Transferencias] DELETE failed:', error);
        res.status(400).json({ ok: false, error: { message: error.message } });
    }
};
