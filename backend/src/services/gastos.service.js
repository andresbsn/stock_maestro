const { Gasto, Caja } = require('../models');

class GastosService {
    static async getAll(filters = {}) {
        const where = {};
        if (filters.caja_id) where.caja_id = filters.caja_id;

        return await Gasto.findAll({
            where,
            include: [
                { model: Caja },
                { model: require('../models').User, as: 'creator' }
            ],
            order: [['created_at', 'DESC']]
        });
    }

    static async createGasto(payload, user) {
        const { caja_id, monto, descripcion, categoria } = payload;
        if (!caja_id) throw new Error('Debe seleccionar una caja');

        return await Gasto.create({
            caja_id,
            monto,
            descripcion,
            categoria,
            created_by: user.id
        });
    }
}

module.exports = GastosService;
