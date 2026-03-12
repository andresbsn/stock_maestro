const { Client } = require('pg');
require('dotenv').config({ path: '../.env' });

const dbName = process.env.DB_NAME || 'inventario_circuito_pm';

const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    database: 'postgres', // Connect to default DB to create the new one
});

async function createDatabase() {
    try {
        await client.connect();
        console.log('Connected to postgres...');

        // Check if db exists
        const res = await client.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${dbName}'`);

        if (res.rowCount === 0) {
            console.log(`Creating database "${dbName}"...`);
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log(`Database "${dbName}" created successfully.`);
        } else {
            console.log(`Database "${dbName}" already exists.`);
        }
    } catch (err) {
        console.error('Error creating database:', err);
    } finally {
        await client.end();
    }
}

createDatabase();
