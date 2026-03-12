require('dotenv').config();
const sequelize = require('../src/config/db');

async function cleanup() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB.');

        console.log('Dropping table "torneos" (lowercase) CASCADE...');
        // Using raw query to force drop with cascade
        await sequelize.query('DROP TABLE IF EXISTS "torneos" CASCADE');
        console.log('Table "torneos" dropped successfully.');

    } catch (error) {
        console.error('Error dropping table:', error.message);
    } finally {
        await sequelize.close();
    }
}

cleanup();
