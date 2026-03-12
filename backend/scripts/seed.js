const { sequelize, User, Complejo, Producto, InventarioGeneral, InventarioComplejo } = require('../src/models');
const ComprasService = require('../src/services/compras.service');
const StockService = require('../src/services/stock.service');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

async function seed() {
    try {
        await sequelize.authenticate();
        console.log('Connected.');
        await sequelize.sync({ alter: true }); // Ensure tables exist

        const t = await sequelize.transaction();

        try {
            // 1. Create Admin
            const adminPass = await bcrypt.hash('admin123', 10);
            const [admin, createdAdmin] = await User.findOrCreate({
                where: { username: 'admin' },
                defaults: {
                    password_hash: adminPass,
                    role: 'ADMIN',
                    active: true
                },
                transaction: t
            });
            console.log('Admin user:', createdAdmin ? 'Created' : 'Already exists');

            // 2. Create Complejos
            const complejosData = [
                { nombre: 'Complejo Central', direccion: 'Av. Principal 123' },
                { nombre: 'Complejo Norte', direccion: 'Calle Norte 456' }
            ];

            const complejos = [];
            for (const cData of complejosData) {
                const [comp] = await Complejo.findOrCreate({
                    where: { nombre: cData.nombre },
                    defaults: cData,
                    transaction: t
                });
                complejos.push(comp);
            }
            console.log('Complejos created/found');

            // 3. Create Users for Complejos
            for (const comp of complejos) {
                const userPass = await bcrypt.hash('user123', 10);
                await User.findOrCreate({
                    where: { username: `user_${comp.id}` },
                    defaults: {
                        password_hash: userPass,
                        role: 'COMPLEJO',
                        complejo_id: comp.id,
                        active: true
                    },
                    transaction: t
                });
            }
            console.log('Complejo users created');

            // 4. Create Products
            const productsData = [
                { sku: 'BEB-001', nombre: 'Coca Cola 500ml', precio_venta_unitario: 1500 },
                { sku: 'BEB-002', nombre: 'Agua Mineral 500ml', precio_venta_unitario: 1000 },
                { sku: 'SNK-001', nombre: 'Papas Lays', precio_venta_unitario: 1200 }
            ];

            const products = [];
            for (const pData of productsData) {
                const [prod] = await Producto.findOrCreate({
                    where: { sku: pData.sku },
                    defaults: pData,
                    transaction: t
                });
                products.push(prod);
            }
            console.log('Products created');

            // 5. Initial Stock (via NotaCompra logic simulation or direct Service)
            // We'll use ComprasService to simulate a purchase to add stock cleanly with movements
            // But ComprasService creates its own transaction. We should commit current t first?
            // Or use the service inside our transaction if it supported passing 't'.
            // My Service implementation wraps in new transaction `sequelize.transaction`.
            // So I will commit the setup data first.

            await t.commit();
            console.log('Basic data committed. Adding stock...');

            // Now add stock via Service (creates its own transactions)
            // Buying 100 of each product
            const compraItems = products.map(p => ({
                producto_id: p.id,
                quantity: 100,
                cost: p.precio_venta_unitario * 0.6 // 40% margin
            }));

            await ComprasService.createNotaCompra({
                proveedor: 'Proveedor Demo',
                observaciones: 'Stock inicial seed',
                items: compraItems
            }, admin); // Action by Admin

            console.log('Initial Purchase (Stock) created successfully via Service.');

        } catch (err) {
            await t.rollback();
            throw err;
        }

    } catch (error) {
        console.error('Seed error:', error);
    } finally {
        await sequelize.close();
    }
}

seed();
