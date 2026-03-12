const { sequelize, Devolucion, DevolucionItem, Caja, Producto } = require('../models');
const StockService = require('./stock.service');

class DevolucionesService {
    static async getAll(filters = {}) {
        const where = {};
        if (filters.caja_id) where.caja_id = filters.caja_id;

        return await Devolucion.findAll({
            where,
            include: [
                { model: DevolucionItem, as: 'items', include: ['producto'] },
                { model: Caja },
                { model: require('../models').User, as: 'creator' }
            ],
            order: [['created_at', 'DESC']]
        });
    }

    static async createDevolucion(payload, user) {
        const { caja_id, items } = payload;
        if (!caja_id) throw new Error('Debe seleccionar una caja');
        if (!items || items.length === 0) throw new Error('Debe cargar al menos un producto');

        return await sequelize.transaction(async (t) => {
            const caja = await Caja.findByPk(caja_id, { transaction: t });
            if (!caja) throw new Error('Caja no encontrada');

            const devolucion = await Devolucion.create({
                caja_id,
                created_by: user.id
            }, { transaction: t });

            for (const item of items) {
                const producto = await Producto.findByPk(item.producto_id, { transaction: t });
                if (!producto) throw new Error(`Producto ${item.producto_id} no encontrado`);

                const costoSnap = producto.costo_unitario;
                const subtotal = costoSnap * item.quantity;

                await DevolucionItem.create({
                    devolucion_id: devolucion.id,
                    producto_id: item.producto_id,
                    cantidad: item.quantity,
                    costo_unitario_snapshot: costoSnap,
                    subtotal
                }, { transaction: t });

                await StockService.addComplexStock(
                    caja.complejo_id,
                    item.producto_id,
                    item.quantity,
                    {
                        tipo: 'RETURN_IN',
                        ref_tipo: 'Devolucion',
                        ref_id: devolucion.id,
                        torneo_id: caja.torneo_id,
                        created_by: user.id
                    },
                    t
                );
            }

            return devolucion;
        });
    }
}

module.exports = DevolucionesService;
