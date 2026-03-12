const { InventarioGeneral, InventarioComplejo, MovimientoStock, sequelize } = require('../models');

class StockService {

    static async createMovimientoStock(data, transaction) {
        return await MovimientoStock.create(data, { transaction });
    }

    static async addGeneralStock(productoId, qty, refData, transaction) {
        // 1. Find or create inventory record
        let [inventory] = await InventarioGeneral.findOrCreate({
            where: { producto_id: productoId },
            defaults: { stock: 0 },
            transaction
        });

        // 2. Update stock
        inventory.stock += qty;
        await inventory.save({ transaction });

        // 3. Log movement
        await this.createMovimientoStock({
            scope: 'GENERAL',
            producto_id: productoId,
            tipo: refData.tipo, // e.g. PURCHASE_IN
            cantidad_signed: qty,
            stock_resultante: inventory.stock,
            ref_tipo: refData.ref_tipo,
            ref_id: refData.ref_id,
            created_by: refData.created_by
        }, transaction);

        return inventory;
    }

    static async removeGeneralStock(productoId, qty, refData, transaction) {
        let inventory = await InventarioGeneral.findOne({
            where: { producto_id: productoId },
            transaction
        });

        if (!inventory || inventory.stock < qty) {
            throw new Error(`Stock general insuficiente para producto ${productoId}. Disponible: ${inventory ? inventory.stock : 0}`);
        }

        inventory.stock -= qty;
        await inventory.save({ transaction });

        await this.createMovimientoStock({
            scope: 'GENERAL',
            producto_id: productoId,
            tipo: refData.tipo, // e.g. TRANSFER_OUT_GENERAL
            cantidad_signed: -qty, // negative
            stock_resultante: inventory.stock,
            ref_tipo: refData.ref_tipo,
            ref_id: refData.ref_id,
            created_by: refData.created_by
        }, transaction);

        return inventory;
    }

    static async addComplexStock(complejoId, productoId, qty, refData, transaction) {
        let [inventory] = await InventarioComplejo.findOrCreate({
            where: { complejo_id: complejoId, producto_id: productoId },
            defaults: { stock: 0 },
            transaction
        });

        inventory.stock += qty;
        await inventory.save({ transaction });

        await this.createMovimientoStock({
            scope: 'COMPLEJO',
            complejo_id: complejoId,
            producto_id: productoId,
            tipo: refData.tipo, // e.g. TRANSFER_IN_COMPLEX
            cantidad_signed: qty,
            stock_resultante: inventory.stock,
            ref_tipo: refData.ref_tipo,
            ref_id: refData.ref_id,
            torneo_id: refData.torneo_id || null,
            created_by: refData.created_by
        }, transaction);

        return inventory;
    }

    static async removeComplexStock(complejoId, productoId, qty, refData, transaction) {
        let inventory = await InventarioComplejo.findOne({
            where: { complejo_id: complejoId, producto_id: productoId },
            transaction
        });

        if (!inventory || inventory.stock < qty) {
            throw new Error(`Stock insuficiente en complejo ${complejoId} para producto ${productoId}.`);
        }

        inventory.stock -= qty;
        await inventory.save({ transaction });

        await this.createMovimientoStock({
            scope: 'COMPLEJO',
            complejo_id: complejoId,
            producto_id: productoId,
            tipo: refData.tipo, // e.g. SALE_OUT
            cantidad_signed: -qty,
            stock_resultante: inventory.stock,
            ref_tipo: refData.ref_tipo,
            ref_id: refData.ref_id,
            torneo_id: refData.torneo_id || null,
            created_by: refData.created_by
        }, transaction);

        return inventory;
    }
}

module.exports = StockService;
