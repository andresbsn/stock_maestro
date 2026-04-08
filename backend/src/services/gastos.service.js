const { Gasto, Torneo } = require('../models');

class GastosService {
    static async getAll(filters = {}) {
        const where = {};
        if (filters.torneo_id) where.torneo_id = filters.torneo_id;

        return await Gasto.findAll({
            where,
            include: [
                { model: Torneo },
                { model: require('../models').User, as: 'creator' }
            ],
            order: [['created_at', 'DESC']]
        });
    }

    static async createGasto(payload, user) {
        const { torneo_id, monto, descripcion, categoria } = payload;
        if (!torneo_id) throw new Error('Debe seleccionar un torneo');

        return await Gasto.create({
            torneo_id,
            monto,
            descripcion,
            categoria,
            created_by: user.id
        });
    }
}

module.exports = GastosService;
