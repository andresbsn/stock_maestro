const { User, Complejo } = require('../models');
const bcrypt = require('bcryptjs');

exports.getAll = async (req, res) => {
    try {
        const users = await User.findAll({
            include: [{ model: Complejo, as: 'complejo' }],
            attributes: { exclude: ['password_hash'] }
        });
        res.json({ ok: true, data: users });
    } catch (error) {
        res.status(500).json({ ok: false, error: { message: error.message } });
    }
};

exports.create = async (req, res) => {
    try {
        const { username, password, role, complejo_id } = req.body;

        // Validaciones básicas
        if (!username || !password || !role) {
            return res.status(400).json({ ok: false, error: { message: 'Faltan campos requeridos' } });
        }

        // Si el rol es COMPLEJO, complejo_id es obligatorio
        if (role === 'COMPLEJO' && !complejo_id) {
            return res.status(400).json({ ok: false, error: { message: 'El complejo es requerido para usuarios de tipo COMPLEJO' } });
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ ok: false, error: { message: 'El nombre de usuario ya está en uso' } });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            password_hash,
            role,
            complejo_id: role === 'COMPLEJO' ? complejo_id : null,
            active: true
        });

        const userResponse = newUser.toJSON();
        delete userResponse.password_hash;

        res.status(201).json({ ok: true, data: userResponse });
    } catch (error) {
        res.status(500).json({ ok: false, error: { message: error.message } });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, role, complejo_id, active } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ ok: false, error: { message: 'Usuario no encontrado' } });
        }

        const updates = {};
        if (username) updates.username = username;
        if (role) updates.role = role;
        if (active !== undefined) updates.active = active;
        
        // Solo actualizar complejo_id si se envía y el rol lo permite (o si se cambia el rol a COMPLEJO)
        const targetRole = role || user.role;
        if (targetRole === 'COMPLEJO') {
             if (complejo_id !== undefined) updates.complejo_id = complejo_id;
        } else {
             updates.complejo_id = null;
        }

        if (password) {
            updates.password_hash = await bcrypt.hash(password, 10);
        }

        await user.update(updates);

        const userResponse = user.toJSON();
        delete userResponse.password_hash;

        res.json({ ok: true, data: userResponse });
    } catch (error) {
        res.status(500).json({ ok: false, error: { message: error.message } });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ ok: false, error: { message: 'Usuario no encontrado' } });
        }
        // Opcional: Soft delete o desactivar en lugar de borrar
        // Por ahora borrar físico como ejemplo básico, o mejor desactivar
        // await user.destroy(); 
        
        // Mejor desactivar
        await user.update({ active: false });
        
        res.json({ ok: true, data: { message: 'Usuario desactivado' } });
    } catch (error) {
        res.status(500).json({ ok: false, error: { message: error.message } });
    }
};
