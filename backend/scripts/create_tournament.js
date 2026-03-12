const { sequelize } = require('../src/models');
const { DataTypes } = require('sequelize');

async function createTournament() {
    try {
        await sequelize.authenticate();

        // Define model inline if not exported or just raw insert
        // Assuming 'Torneo' model exists in models/index.js
        const Torneo = sequelize.models.Torneo;

        if (!Torneo) {
            console.error("Torneo model not found!");
            return;
        }

        const [torneo, created] = await Torneo.findOrCreate({
            where: { id: 1 },
            defaults: {
                nombre: 'Torneo Apertura 2026',
                fecha_inicio: new Date(),
                estado: 'ACTIVO'
            }
        });

        console.log(created ? 'Default Tournament created (ID 1).' : 'Tournament ID 1 already exists.');

    } catch (error) {
        console.error('Error creating tournament:', error);
    } finally {
        await sequelize.close();
    }
}

createTournament();
