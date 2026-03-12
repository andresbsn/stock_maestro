const { sequelize, OrdenTransferencia, OrdenTransferenciaItem } = require('../models');
const StockService = require('./stock.service');

class TransferenciasService {

    static async getAll(filters = {}) {
        const where = {};
        if (filters.complejo_id) {
            where.complejo_id = filters.complejo_id;
        }

        return await OrdenTransferencia.findAll({
            where,
            include: [
                { model: OrdenTransferenciaItem, as: 'items', include: ['producto'] },
                { model: require('../models').Complejo, as: 'complejoDestino' },
                { model: require('../models').User, as: 'creator' }
            ],
            order: [['fecha', 'DESC']]
        });
    }

    static async createOrden(payload, user) {
        // payload: { complejo_id, items: [{ producto_id, quantity }], es_gasto? }
        return await sequelize.transaction(async (t) => {
            const orden = await OrdenTransferencia.create({
                complejo_id: payload.complejo_id,
                estado: 'BORRADOR',
                es_gasto: payload.es_gasto || false,
                created_by: user.id,
                fecha: new Date()
            }, { transaction: t });

            for (const item of payload.items) {
                await OrdenTransferenciaItem.create({
                    orden_id: orden.id,
                    producto_id: item.producto_id,
                    cantidad: item.quantity
                }, { transaction: t });
            }

            return orden;
        });
    }

    static async confirmarOrden(ordenId, user) {
        return await sequelize.transaction(async (t) => {
            const orden = await OrdenTransferencia.findByPk(ordenId, {
                include: ['items'],
                transaction: t
            });

            if (!orden) throw new Error('Orden no encontrada');
            if (orden.estado !== 'BORRADOR') throw new Error('La orden no está en borrador');

            for (const item of orden.items) {
                // 1. Remove from General
                await StockService.removeGeneralStock(
                    item.producto_id,
                    item.cantidad,
                    {
                        tipo: 'TRANSFER_OUT_GENERAL',
                        ref_tipo: 'OrdenTransferencia',
                        ref_id: orden.id,
                        created_by: user.id
                    },
                    t
                );

                // 2. Add to Complex
                await StockService.addComplexStock(
                    orden.complejo_id,
                    item.producto_id,
                    item.cantidad,
                    {
                        tipo: 'TRANSFER_IN_COMPLEX',
                        ref_tipo: 'OrdenTransferencia',
                        ref_id: orden.id,
                        created_by: user.id
                    },
                    t
                );
            }

            orden.estado = 'CONFIRMADA';
            await orden.save({ transaction: t });

            return orden;
        });
    }

    static async updateOrden(ordenId, payload) {
        return await sequelize.transaction(async (t) => {
            const orden = await OrdenTransferencia.findByPk(ordenId, { include: ['items'], transaction: t });
            if (!orden) throw new Error('Orden no encontrada');
            if (orden.estado !== 'BORRADOR') throw new Error('Solo se pueden editar ordenes en borrador');

            // Update basic info if allowed (e.g., complex)
            if (payload.complejo_id) {
                orden.complejo_id = payload.complejo_id;
            }

            if (payload.es_gasto !== undefined) {
                orden.es_gasto = payload.es_gasto;
            }

            await orden.save({ transaction: t });

            // Sync Items: Simplest strategy is wipe items and recreate
            await OrdenTransferenciaItem.destroy({ where: { orden_id: ordenId }, transaction: t });

            for (const item of payload.items) {
                await OrdenTransferenciaItem.create({
                    orden_id: orden.id,
                    producto_id: item.producto_id,
                    cantidad: item.quantity,
                    es_gasto: item.es_gasto || false
                }, { transaction: t });
            }

            return await OrdenTransferencia.findByPk(ordenId, { include: ['items'], transaction: t });
        });
    }

    static async deleteOrden(ordenId) {
        return await sequelize.transaction(async (t) => {
            const orden = await OrdenTransferencia.findByPk(ordenId);
            if (!orden) throw new Error('Orden no encontrada');
            if (orden.estado !== 'BORRADOR') throw new Error('Solo se pueden eliminar ordenes en borrador');

            await OrdenTransferenciaItem.destroy({ where: { orden_id: ordenId }, transaction: t });
            await orden.destroy({ transaction: t });
            return true;
        });
    }
}

module.exports = TransferenciasService;
