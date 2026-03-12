const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/productos', require('./routes/productos.routes'));
app.use('/api/compras', require('./routes/compras.routes'));
app.use('/api/transferencias', require('./routes/transferencias.routes'));
app.use('/api/torneos', require('./routes/torneos.routes'));
app.use('/api/cajas', require('./routes/cajas.routes'));
app.use('/api/ventas', require('./routes/ventas.routes'));
app.use('/api/gastos', require('./routes/gastos.routes'));
app.use('/api/devoluciones', require('./routes/devoluciones.routes'));
app.use('/api/reportes', require('./routes/reportes.routes'));
// app.use('/api/inventario', require('./routes/inventario.routes'));

app.get('/', (req, res) => {
    res.json({ message: 'API System Running' });
});

module.exports = app;
