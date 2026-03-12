const { Torneo } = require('../models');

class TorneosService {
    static async getAll() {
        // Return all tournaments, ordered by newest first
        return await Torneo.findAll({
            order: [['created_at', 'DESC']]
        });
    }

    static async getActive() {
        return await Torneo.findAll({
            where: { estado: 'ACTIVO' },
            order: [['created_at', 'DESC']]
        });
    }

    static async create(payload) {
        // payload: { nombre, fecha_inicio, fecha_fin? }
        return await Torneo.create({
            nombre: payload.nombre,
            fecha_inicio: payload.fecha_inicio,
            fecha_fin: payload.fecha_fin,
            estado: 'ACTIVO'
        });
    }

    static async update(id, payload) {
        const [updated] = await Torneo.update(payload, { where: { id } });
        if (!updated) throw new Error('Torneo no encontrado');
        return await Torneo.findByPk(id);
    }

    static async delete(id) {
        const deleted = await Torneo.destroy({ where: { id } });
        if (!deleted) throw new Error('Torneo no encontrado');
        return true;
    }
}

module.exports = TorneosService;
