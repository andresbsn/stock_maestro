require('dotenv').config();
const { InventarioComplejo, InventarioGeneral, Producto } = require('../src/models');
const sequelize = require('../src/config/db');

async function check() {
    try {
        await sequelize.authenticate();
        console.log('DB Connection: OK');

        console.log('--- Inventario General ---');
        const general = await InventarioGeneral.findAll();
        console.log(JSON.stringify(general, null, 2));

        console.log('--- Inventario Complejo ---');
        const complex = await InventarioComplejo.findAll();
        console.log(JSON.stringify(complex, null, 2));

    } catch (err) {
        console.error('DB Check Failed:', err);
    } finally {
        await sequelize.close();
    }
}

check();
