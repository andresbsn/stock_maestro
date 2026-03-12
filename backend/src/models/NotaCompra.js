const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const NotaCompra = sequelize.define('NotaCompra', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    proveedor: {
        type: DataTypes.STRING,
        allowNull: true
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true
    }
    // created_by (User) association
});

module.exports = NotaCompra;
