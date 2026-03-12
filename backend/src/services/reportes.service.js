const { Caja, Venta, VentaItem, Gasto, Devolucion, DevolucionItem, OrdenTransferencia, OrdenTransferenciaItem } = require('../models');

class ReportesService {
    static async getUserCajaReporte(user) {
        const caja = await Caja.findOne({
            where: { estado: 'ABIERTA', complejo_id: user.complejo_id },
            order: [['opened_at', 'DESC']]
        });

        if (!caja) {
            return { caja: null, totales_por_pago: {}, ventas: [] };
        }

        const ventas = await Venta.findAll({
            where: { caja_id: caja.id },
            include: [{ model: VentaItem, as: 'items' }],
            order: [['created_at', 'DESC']]
        });

        const totalesPorPago = ventas.reduce((acc, venta) => {
            const metodo = venta.metodo_pago;
            acc[metodo] = (acc[metodo] || 0) + Number(venta.total || 0);
            return acc;
        }, {});

        return { caja, totales_por_pago: totalesPorPago, ventas };
    }

    static async getAdminReporte(filters = {}) {
        const whereVentas = {};
        const whereGastos = {};
        const whereDevoluciones = {};

        if (filters.caja_id) {
            whereVentas.caja_id = filters.caja_id;
            whereGastos.caja_id = filters.caja_id;
            whereDevoluciones.caja_id = filters.caja_id;
        }

        const [ventas, gastos, devoluciones, transferencias] = await Promise.all([
            Venta.findAll({
                where: whereVentas,
                include: [{ model: VentaItem, as: 'items', include: ['producto'] }],
                order: [['created_at', 'DESC']]
            }),
            Gasto.findAll({
                where: whereGastos,
                order: [['created_at', 'DESC']]
            }),
            Devolucion.findAll({
                where: whereDevoluciones,
                include: [{ model: DevolucionItem, as: 'items', include: ['producto'] }],
                order: [['created_at', 'DESC']]
            }),
            OrdenTransferencia.findAll({
                where: { estado: 'CONFIRMADA' },
                include: [{ model: OrdenTransferenciaItem, as: 'items', include: ['producto'] }],
                order: [['fecha', 'DESC']]
            })
        ]);

        let ventasTotal = 0;
        let ventasCosto = 0;
        let ventasGanancia = 0;
        let gastosVentasTipo = 0;

        ventas.forEach((venta) => {
            ventasTotal += Number(venta.total || 0);
            (venta.items || []).forEach((item) => {
                const costo = Number(item.costo_unitario_snapshot || 0) * item.cantidad;
                if (item.tipo === 'GASTO') {
                    gastosVentasTipo += costo;
                } else {
                    ventasCosto += costo;
                    ventasGanancia += (Number(item.precio_unitario_snapshot || 0) - Number(item.costo_unitario_snapshot || 0)) * item.cantidad;
                }
            });
        });

        const transferenciasGastoTotal = transferencias.reduce((acc, orden) => {
            const subtotal = (orden.items || []).reduce((sum, item) => {
                // Count as expense if parent order is expense (legacy) OR specific item is expense
                if (orden.es_gasto || item.es_gasto) {
                    const costo = Number(item.producto?.costo_unitario || 0);
                    return sum + (costo * item.cantidad);
                }
                return sum;
            }, 0);
            return acc + subtotal;
        }, 0);

        // Filter transferencias to only those that have some expense component (for display in frontend if needed)
        const transferenciasGasto = transferencias.filter(t => t.es_gasto || t.items.some(i => i.es_gasto));

        const gastosTotal = gastos.reduce((acc, gasto) => acc + Number(gasto.monto || 0), 0)
            + gastosVentasTipo
            + transferenciasGastoTotal;
        const devolucionesCostoTotal = devoluciones.reduce((acc, devolucion) => {
            const subtotal = (devolucion.items || []).reduce((sum, item) => sum + Number(item.subtotal || 0), 0);
            return acc + subtotal;
        }, 0);

        const gananciaNeta = ventasGanancia - gastosTotal + devolucionesCostoTotal;

        return {
            ventas,
            gastos,
            devoluciones,
            transferencias_gasto: transferenciasGasto,
            resumen: {
                ventas_total: ventasTotal,
                ventas_costo: ventasCosto,
                ventas_ganancia: ventasGanancia,
                gastos_total: gastosTotal,
                transferencias_gasto_total: transferenciasGastoTotal,
                devoluciones_costo_total: devolucionesCostoTotal,
                ganancia_neta: gananciaNeta
            }
        };
    }
}

module.exports = ReportesService;
