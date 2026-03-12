const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('ADMIN', 'COMPLEJO'),
        defaultValue: 'COMPLEJO'
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
    // complejo_id will be added via association
});

module.exports = User;
