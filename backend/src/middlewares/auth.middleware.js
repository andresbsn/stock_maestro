const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const header = req.headers['authorization'];
    console.log(`[Auth] Request to ${req.originalUrl}`);
    console.log(`[Auth] Header: ${header}`);

    if (!header) {
        console.warn('[Auth] No authorization header present');
        return res.status(401).json({ ok: false, error: { message: 'No token' } });
    }

    const token = header.split(' ')[1];
    if (!token) {
        console.warn('[Auth] Token is missing from header');
        return res.status(401).json({ ok: false, error: { message: 'Malformed token' } });
    }

    try {
        const secret = process.env.JWT_SECRET || 'secret';
        // console.log('[Auth] Using secret:', secret); // verify secret is loaded
        const decoded = jwt.verify(token, secret);
        console.log(`[Auth] Success. User: ${decoded.username}, Role: ${decoded.role}`);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('[Auth] Verification failed:', err.message);
        return res.status(403).json({ ok: false, error: { message: 'Invalid token' } });
    }
};

const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ ok: false, error: { message: 'Forbidden' } });
        }
        next();
    }
};

module.exports = { authenticate, authorize };
