const { Complejo } = require('../models');

exports.getAll = async (req, res) => {
    try {
        const complejos = await Complejo.findAll();
        res.json({ ok: true, data: complejos });
    } catch (error) {
        res.status(500).json({ ok: false, error: { message: error.message } });
    }
};

exports.create = async (req, res) => {
    try {
        const { nombre, direccion } = req.body;
        const complejo = await Complejo.create({ nombre, direccion });
        res.status(201).json({ ok: true, data: complejo });
    } catch (error) {
        res.status(500).json({ ok: false, error: { message: error.message } });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, direccion } = req.body;
        const complejo = await Complejo.findByPk(id);
        if (!complejo) {
            return res.status(404).json({ ok: false, error: { message: 'Complejo no encontrado' } });
        }
        await complejo.update({ nombre, direccion });
        res.json({ ok: true, data: complejo });
    } catch (error) {
        res.status(500).json({ ok: false, error: { message: error.message } });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const complejo = await Complejo.findByPk(id);
        if (!complejo) {
            return res.status(404).json({ ok: false, error: { message: 'Complejo no encontrado' } });
        }
        await complejo.destroy();
        res.json({ ok: true, data: { message: 'Complejo eliminado' } });
    } catch (error) {
        res.status(500).json({ ok: false, error: { message: error.message } });
    }
};
