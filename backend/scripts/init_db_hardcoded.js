const { Client } = require('pg');

const config = {
    user: 'postgres',
    password: 'postgres_35702',
    host: 'localhost',
    database: 'postgres',
};

const targetDb = 'inventario_circuito_pm';

const client = new Client(config);

async function run() {
    try {
        console.log('Connecting to postgres...');
        await client.connect();
        console.log('Connected.');

        const res = await client.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${targetDb}'`);

        if (res.rowCount === 0) {
            console.log(`Creating database ${targetDb}...`);
            await client.query(`CREATE DATABASE "${targetDb}"`);
            console.log('Database created.');
        } else {
            console.log('Database already exists.');
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

run();
