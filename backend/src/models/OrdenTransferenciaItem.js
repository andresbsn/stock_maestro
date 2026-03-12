const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OrdenTransferenciaItem = sequelize.define('OrdenTransferenciaItem', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    es_gasto: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
    // orden_id, producto_id associations
});

module.exports = OrdenTransferenciaItem;
