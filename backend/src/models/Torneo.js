const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Torneo = sequelize.define('Torneo', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha_inicio: {
        type: DataTypes.DATEONLY
    },
    fecha_fin: {
        type: DataTypes.DATEONLY
    },
    estado: {
        type: DataTypes.ENUM('ACTIVO', 'FINALIZADO'),
        defaultValue: 'ACTIVO'
    }
}, {
    timestamps: true,
    underscored: true,
    tableName: 'Torneos',
    freezeTableName: true
});

module.exports = Torneo;
