const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Producto = sequelize.define('Producto', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    sku: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    unidad: {
        type: DataTypes.STRING,
        defaultValue: 'un'
    },
    costo_unitario: { // Costo promedio o última compra
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    precio_venta_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    solo_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

module.exports = Producto;
