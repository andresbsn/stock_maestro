const { sequelize, Venta, VentaItem, Caja, Producto } = require('../models');
const StockService = require('./stock.service');

class VentasService {

    static async getAll(filters) {
        const where = {};
        if (filters.caja_id) where.caja_id = filters.caja_id;
        if (filters.complejo_id) where.complejo_id = filters.complejo_id;
        // More filters...

        return await Venta.findAll({
            where,
            include: [
                { model: VentaItem, as: 'items', include: ['producto'] },
                { model: Caja }
            ],
            order: [['created_at', 'DESC']]
        });
    }

    static async createVenta(payload, user) {
        // payload: { caja_id, items: [{ producto_id, quantity, descuento? }], metodo_pago, pagos: [{ metodo, monto }], total_pagado }

        return await sequelize.transaction(async (t) => {
            if (payload.metodo_pago === 'CORTESIA' && !payload.detalle_cortesia) {
                throw new Error('Debe ingresar el detalle de la cortesía');
            }

            // 1. Validate Caja
            const caja = await Caja.findByPk(payload.caja_id, { transaction: t });
            if (!caja || caja.estado !== 'ABIERTA') {
                throw new Error('La caja debe estar abierta para vender');
            }

            // 2. Create Venta Header
            const venta = await Venta.create({
                caja_id: payload.caja_id,
                torneo_id: caja.torneo_id,
                complejo_id: caja.complejo_id,
                metodo_pago: payload.metodo_pago,
                detalle_cortesia: payload.detalle_cortesia || null,
                descuento_monto: payload.descuento_monto || 0,
                descuento_porcentaje: payload.descuento_porcentaje || 0,
                created_by: user.id
            }, { transaction: t });

            let totalVenta = 0;

            for (const item of payload.items) {
                const producto = await Producto.findByPk(item.producto_id, { transaction: t });
                if (!producto) throw new Error(`Producto ${item.producto_id} no encontrado`);

                const tipoItem = item.tipo || 'GANANCIA';
                const costoSnap = producto.costo_unitario;
                const precioSnap = producto.precio_venta_unitario;
                const subtotal = precioSnap * item.quantity;
                const ganancia = (precioSnap - costoSnap) * item.quantity;

                if (tipoItem === 'GASTO' && !producto.solo_admin) {
                    producto.solo_admin = true;
                    await producto.save({ transaction: t });
                }

                // 3. Create Item
                await VentaItem.create({
                    venta_id: venta.id,
                    producto_id: item.producto_id,
                    cantidad: item.quantity,
                    tipo: tipoItem,
                    costo_unitario_snapshot: costoSnap,
                    precio_unitario_snapshot: precioSnap,
                    subtotal,
                    ganancia
                }, { transaction: t });

                totalVenta += subtotal;

                // 4. Remove Stock (Complex)
                await StockService.removeComplexStock(
                    caja.complejo_id,
                    item.producto_id,
                    item.quantity,
                    {
                        tipo: 'SALE_OUT',
                        ref_tipo: 'Venta',
                        ref_id: venta.id,
                        torneo_id: caja.torneo_id,
                        created_by: user.id
                    },
                    t
                );
            }

            // Apply Global Discounts if logic requires (simplified here)
            // totalVenta = applyDiscount(totalVenta, ...);
            const pagos = Array.isArray(payload.pagos)
                ? payload.pagos.filter(pago => pago && pago.metodo && Number(pago.monto) > 0)
                : [];
            const totalPagado = pagos.length > 0
                ? pagos.reduce((acc, pago) => acc + Number(pago.monto || 0), 0)
                : Number(payload.total_pagado || 0);

            if (pagos.length === 0) {
                const metodoPago = payload.metodo_pago || 'EFECTIVO';
                if (totalPagado > 0) {
                    pagos.push({ metodo: metodoPago, monto: totalPagado });
                }
            }

            if (payload.metodo_pago === 'CORTESIA') {
                const cortesiaMonto = totalPagado > 0 ? totalPagado : totalVenta;
                venta.total_pagado = cortesiaMonto;
                venta.pagos = [{ metodo: 'CORTESIA', monto: cortesiaMonto }];
            } else {
                if (totalPagado > totalVenta) {
                    throw new Error('El total pagado no puede superar el total de la venta');
                }
                venta.total_pagado = totalPagado;
                venta.pagos = pagos.length > 0 ? pagos : null;
            }

            venta.total = totalVenta;
            await venta.save({ transaction: t });

            return venta;
        });
    }
}

module.exports = VentasService;
