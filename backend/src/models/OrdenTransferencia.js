const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OrdenTransferencia = sequelize.define('OrdenTransferencia', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    estado: {
        type: DataTypes.ENUM('BORRADOR', 'CONFIRMADA', 'CANCELADA'),
        defaultValue: 'BORRADOR'
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    es_gasto: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
    // complejo_id, created_by associations
});

module.exports = OrdenTransferencia;
