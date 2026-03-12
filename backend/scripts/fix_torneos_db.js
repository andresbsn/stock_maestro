const { Sequelize } = require('sequelize');
const sequelize = require('../src/config/db');

async function fixTorneosTable() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB.');

        const queryInterface = sequelize.getQueryInterface();

        // Check if table exists
        const tables = await queryInterface.showAllTables();
        console.log('Tables:', tables);

        // Check columns in Torneos
        const tableDescription = await queryInterface.describeTable('Torneos');
        console.log('Torneos columns:', tableDescription);

        if (!tableDescription.created_at) {
            console.log('Adding created_at column...');
            await queryInterface.addColumn('Torneos', 'created_at', {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            });
        } else {
            console.log('created_at already exists.');
        }

        if (!tableDescription.updated_at) {
            console.log('Adding updated_at column...');
            await queryInterface.addColumn('Torneos', 'updated_at', {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            });
        } else {
            console.log('updated_at already exists.');
        }

    } catch (error) {
        console.error('Error fixing DB:', error);
    } finally {
        await sequelize.close();
    }
}

fixTorneosTable();
