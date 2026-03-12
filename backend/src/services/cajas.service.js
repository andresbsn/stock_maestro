const { Caja, sequelize } = require('../models');

class CajasService {

    static async abrirCaja(torneoId, complejoId, montoInicial, user) {
        // Check if open already
        const existing = await Caja.findOne({
            where: {
                torneo_id: torneoId,
                complejo_id: complejoId,
                estado: 'ABIERTA'
            }
        });

        if (existing) throw new Error('Ya existe una caja abierta para este torneo y complejo');

        return await Caja.create({
            torneo_id: torneoId,
            complejo_id: complejoId,
            monto_inicial: montoInicial,
            estado: 'ABIERTA',
            opened_by: user.id,
            opened_at: new Date()
        });
    }

    static async cerrarCaja(cajaId, montoFinal, user) {
        const caja = await Caja.findByPk(cajaId);
        if (!caja || caja.estado !== 'ABIERTA') throw new Error('Caja no válida o ya cerrada');

        caja.estado = 'CERRADA';
        caja.closed_at = new Date();
        caja.closed_by = user.id;
        caja.monto_final = montoFinal; // Real cash count

        // Future stats logic could compare theoretical balance vs real balance here

        await caja.save();
        return caja;
    }

    static async getActive(complejoId, torneoId) {
        const where = { estado: 'ABIERTA' };
        if (complejoId) where.complejo_id = complejoId;
        // if (torneoId) where.torneo_id = torneoId; // Optional filter

        return await Caja.findOne({ 
            where,
            include: [
                { model: require('../models').User, as: 'opener' },
                { model: require('../models').User, as: 'closer' },
                {
                    model: require('../models').Venta,
                    as: 'ventas',
                    include: [
                        {
                            model: require('../models').VentaItem,
                            as: 'items',
                            include: [{ model: require('../models').Producto, as: 'producto' }]
                        },
                        { model: require('../models').User, as: 'vendedor' }
                    ]
                },
                {
                    model: require('../models').Gasto,
                    as: 'gastos',
                    include: [{ model: require('../models').User, as: 'creator' }]
                },
                {
                    model: require('../models').Devolucion,
                    as: 'devoluciones',
                    include: [
                        {
                            model: require('../models').DevolucionItem,
                            as: 'items',
                            include: [{ model: require('../models').Producto, as: 'producto' }]
                        },
                        { model: require('../models').User, as: 'creator' }
                    ]
                }
            ]
        });
    }

    static async getAll() {
        return await Caja.findAll({
            include: [
                { model: require('../models').User, as: 'opener' },
                { model: require('../models').User, as: 'closer' }
            ],
            order: [['created_at', 'DESC']]
        });
    }

    static async getById(id) {
        const caja = await Caja.findByPk(id, {
            include: [
                { model: require('../models').User, as: 'opener' },
                { model: require('../models').User, as: 'closer' },
                {
                    model: require('../models').Venta,
                    as: 'ventas',
                    include: [
                        {
                            model: require('../models').VentaItem,
                            as: 'items',
                            include: [{ model: require('../models').Producto, as: 'producto' }]
                        },
                        { model: require('../models').User, as: 'vendedor' }
                    ]
                },
                {
                    model: require('../models').Gasto,
                    as: 'gastos',
                    include: [{ model: require('../models').User, as: 'creator' }]
                },
                {
                    model: require('../models').Devolucion,
                    as: 'devoluciones',
                    include: [
                        {
                            model: require('../models').DevolucionItem,
                            as: 'items',
                            include: [{ model: require('../models').Producto, as: 'producto' }]
                        },
                        { model: require('../models').User, as: 'creator' }
                    ]
                }
            ]
        });
        if (!caja) throw new Error('Caja no encontrada');
        return caja;
    }
}

module.exports = CajasService;
