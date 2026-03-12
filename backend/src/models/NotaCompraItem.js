const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const NotaCompraItem = sequelize.define('NotaCompraItem', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    costo_unitario_snapshot: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
    // nota_id, producto_id associations
});

module.exports = NotaCompraItem;
