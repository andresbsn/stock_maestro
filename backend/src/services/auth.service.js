const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
    static async login(username, password) {
        const user = await User.findOne({ where: { username, active: true } });
        if (!user) {
            throw new Error('Usuario no encontrado o inactivo');
        }

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
            throw new Error('Contraseña incorrecta');
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role, complejo_id: user.complejo_id },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '8h' }
        );

        return { user, token };
    }
}

module.exports = AuthService;
