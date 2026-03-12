const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MovimientoStock = sequelize.define('MovimientoStock', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    scope: {
        type: DataTypes.ENUM('GENERAL', 'COMPLEJO'),
        allowNull: false
    },
    tipo: {
        type: DataTypes.STRING, // PURCHASE_IN, TRANSFER_OUT_GENERAL, TRANSFER_IN_COMPLEX, SALE_OUT, ADJUSTMENT
        allowNull: false
    },
    cantidad_signed: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    stock_resultante: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ref_tipo: {
        type: DataTypes.STRING // 'NotaCompra', 'OrdenTransferencia', 'Venta', 'AjusteManual'
    },
    ref_id: {
        type: DataTypes.INTEGER
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = MovimientoStock;
