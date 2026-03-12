const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Caja = sequelize.define('Caja', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    estado: {
        type: DataTypes.ENUM('ABIERTA', 'CERRADA'),
        defaultValue: 'ABIERTA'
    },
    monto_inicial: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    monto_final: { // Cash count at close
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    opened_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    closed_at: {
        type: DataTypes.DATE
    }
    // links: torneo_id, complejo_id, opened_by, closed_by
});

module.exports = Caja;
