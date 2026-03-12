const AuthService = require('../services/auth.service');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const { user, token } = await AuthService.login(username, password);
        res.json({ ok: true, data: { token, user: { id: user.id, username: user.username, role: user.role, complejo_id: user.complejo_id } } });
    } catch (error) {
        res.status(401).json({ ok: false, error: { message: error.message } });
    }
};

exports.me = (req, res) => {
    res.json({ ok: true, data: req.user });
};
