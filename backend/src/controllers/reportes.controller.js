const ReportesService = require('../services/reportes.service');

exports.reporteUsuario = async (req, res) => {
    try {
        const reporte = await ReportesService.getUserCajaReporte(req.user);
        res.json({ ok: true, data: reporte });
    } catch (error) {
        res.status(500).json({ ok: false, error: { message: error.message } });
    }
};

exports.reporteAdmin = async (req, res) => {
    try {
        const reporte = await ReportesService.getAdminReporte(req.query);
        res.json({ ok: true, data: reporte });
    } catch (error) {
        res.status(500).json({ ok: false, error: { message: error.message } });
    }
};
