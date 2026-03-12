const { sequelize, NotaCompra, NotaCompraItem, Producto } = require('../models');
const StockService = require('./stock.service');

class ComprasService {

    static async getAll() {
        return await NotaCompra.findAll({
            include: [
                { model: NotaCompraItem, as: 'items', include: ['producto'] },
                { model: require('../models').User, as: 'creator' }
            ],
            order: [['fecha', 'DESC']]
        });
    }

    static async createNotaCompra(payload, user) {
        // payload: { proveedor, observaciones, items: [{ producto_id, quantity, cost }] }

        return await sequelize.transaction(async (t) => {
            const nota = await NotaCompra.create({
                fecha: new Date(),
                proveedor: payload.proveedor,
                observaciones: payload.observaciones,
                created_by: user.id
            }, { transaction: t });

            for (const item of payload.items) {
                // 1. Create Item
                await NotaCompraItem.create({
                    nota_id: nota.id,
                    producto_id: item.producto_id,
                    cantidad: item.quantity,
                    costo_unitario_snapshot: item.cost
                }, { transaction: t });

                // 2. Update Product Cost (Optional strategy: Last Purchase Price)
                const product = await Producto.findByPk(item.producto_id, { transaction: t });
                if (product) {
                    product.costo_unitario = item.cost;
                    await product.save({ transaction: t });
                }

                // 3. Add to General Stock
                await StockService.addGeneralStock(
                    item.producto_id,
                    item.quantity,
                    {
                        tipo: 'PURCHASE_IN',
                        ref_tipo: 'NotaCompra',
                        ref_id: nota.id,
                        created_by: user.id
                    },
                    t
                );
            }

            return nota;
        });
    }
}

module.exports = ComprasService;
