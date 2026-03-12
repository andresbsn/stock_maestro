const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const VentaItem = sequelize.define('VentaItem', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tipo: {
        type: DataTypes.ENUM('GANANCIA', 'GASTO'),
        defaultValue: 'GANANCIA'
    },
    costo_unitario_snapshot: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    precio_unitario_snapshot: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    ganancia: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
});

module.exports = VentaItem;
