require('dotenv').config();
const { User } = require('../src/models');
const sequelize = require('../src/config/db');

async function checkUsers() {
    try {
        await sequelize.authenticate();
        console.log('DB OK');
        const users = await User.findAll({ attributes: ['id', 'username', 'role', 'complejo_id'] });
        console.log('Users:', JSON.stringify(users, null, 2));
    } catch (e) { console.error(e); }
    finally { sequelize.close(); }
}
checkUsers();
