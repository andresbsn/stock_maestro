const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const InventarioGeneral = sequelize.define('InventarioGeneral', {
    // producto_id will be PK via association
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
});

module.exports = InventarioGeneral;
