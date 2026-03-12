const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Complejo = sequelize.define('Complejo', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Complejo;
