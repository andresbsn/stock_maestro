const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Venta = sequelize.define('Venta', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    total_pagado: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    metodo_pago: {
        type: DataTypes.ENUM('EFECTIVO', 'TRANSFERENCIA', 'QR', 'OTRO', 'CORTESIA'),
        defaultValue: 'EFECTIVO'
    },
    pagos: {
        type: DataTypes.JSON,
        allowNull: true
    },
    detalle_cortesia: {
        type: DataTypes.STRING,
        allowNull: true
    },
    descuento_monto: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    descuento_porcentaje: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    // Audit
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = Venta;
