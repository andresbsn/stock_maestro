require('dotenv').config();
const { Torneo } = require('../src/models');
const sequelize = require('../src/config/db');

async function check() {
    try {
        await sequelize.authenticate();
        console.log('DB Connection: OK');

        // Check if table exists by querying
        const items = await Torneo.findAll();
        console.log('Torneos Count:', items.length);

        if (items.length > 0) {
            console.log('First Torneo:', JSON.stringify(items[0], null, 2));
        } else {
            console.log('No torneos found (Table exists and is empty).');
        }

    } catch (err) {
        console.error('DB Check Failed:', err);
    } finally {
        await sequelize.close();
    }
}

check();
