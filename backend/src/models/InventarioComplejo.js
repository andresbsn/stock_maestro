const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const InventarioComplejo = sequelize.define('InventarioComplejo', {
    // PK will be composite (complejo_id, producto_id) handled by associations or explicitly here if needed.
    // Sequelize association 'belongsToMany' with 'through' usually handles this, 
    // but for explicit control we define the model.
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
});

module.exports = InventarioComplejo;
