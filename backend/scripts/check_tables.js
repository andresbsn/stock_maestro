const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const dbConfig1 = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    database: 'postgres',
};

const dbConfig2 = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    database: 'inventario_circuito_pm',
};

async function check() {
    console.log('--- Checking "postgres" database ---');
    const client1 = new Client(dbConfig1);
    try {
        await client1.connect();
        const res = await client1.query('SELECT datname FROM pg_database WHERE datname = $1', ['inventario_circuito_pm']);
        if (res.rows.length > 0) {
            console.log('SUCCESS: Database "inventario_circuito_pm" EXISTS.');
        } else {
            console.log('FAIL: Database "inventario_circuito_pm" DOES NOT EXIST.');
        }
    } catch (e) { console.log('Error connecting to postgres db:', e.message) }
    finally { await client1.end(); }

    console.log('\n--- Checking "inventario_circuito_pm" database ---');
    const client2 = new Client(dbConfig2);
    try {
        await client2.connect();
        const res = await client2.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
        console.log('Tables found:', res.rows.map(r => r.table_name));
    } catch (e) { console.log('Error connecting to inventario_circuito_pm db:', e.message) }
    finally { await client2.end(); }
}

check();
