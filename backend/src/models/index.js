const sequelize = require('../config/db');
const User = require('./User');
const Complejo = require('./Complejo');
const Producto = require('./Producto');
const InventarioGeneral = require('./InventarioGeneral');
const InventarioComplejo = require('./InventarioComplejo');
const NotaCompra = require('./NotaCompra');
const NotaCompraItem = require('./NotaCompraItem');
const OrdenTransferencia = require('./OrdenTransferencia');
const OrdenTransferenciaItem = require('./OrdenTransferenciaItem');
const Torneo = require('./Torneo');
const Caja = require('./Caja');
const Venta = require('./Venta');
const VentaItem = require('./VentaItem');
const MovimientoStock = require('./MovimientoStock');
const Gasto = require('./Gasto');
const Devolucion = require('./Devolucion');
const DevolucionItem = require('./DevolucionItem');

// User -> Complejo
User.belongsTo(Complejo, { foreignKey: 'complejo_id', as: 'complejo' });
Complejo.hasMany(User, { foreignKey: 'complejo_id' });

// Producto -> InventarioGeneral
Producto.hasOne(InventarioGeneral, { foreignKey: 'producto_id', as: 'stockGeneral' });
InventarioGeneral.belongsTo(Producto, { foreignKey: 'producto_id' });

// Producto <-> Complejo via InventarioComplejo
Producto.hasMany(InventarioComplejo, { foreignKey: 'producto_id' });
InventarioComplejo.belongsTo(Producto, { foreignKey: 'producto_id' });
Complejo.hasMany(InventarioComplejo, { foreignKey: 'complejo_id' });
InventarioComplejo.belongsTo(Complejo, { foreignKey: 'complejo_id' });

// Compras
NotaCompra.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
NotaCompra.hasMany(NotaCompraItem, { foreignKey: 'nota_id', as: 'items' });
NotaCompraItem.belongsTo(NotaCompra, { foreignKey: 'nota_id' });
NotaCompraItem.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });

// Transferencias
OrdenTransferencia.belongsTo(Complejo, { foreignKey: 'complejo_id', as: 'complejoDestino' });
OrdenTransferencia.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
OrdenTransferencia.hasMany(OrdenTransferenciaItem, { foreignKey: 'orden_id', as: 'items' });
OrdenTransferenciaItem.belongsTo(OrdenTransferencia, { foreignKey: 'orden_id' });
OrdenTransferenciaItem.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });

// Cajas
Caja.belongsTo(Torneo, { foreignKey: 'torneo_id' });
Torneo.hasMany(Caja, { foreignKey: 'torneo_id' });
Caja.belongsTo(Complejo, { foreignKey: 'complejo_id' });
Caja.belongsTo(User, { foreignKey: 'opened_by', as: 'opener' });
Caja.belongsTo(User, { foreignKey: 'closed_by', as: 'closer' });

// Ventas
Venta.belongsTo(Caja, { foreignKey: 'caja_id' });
Caja.hasMany(Venta, { foreignKey: 'caja_id', as: 'ventas' });
Venta.belongsTo(Torneo, { foreignKey: 'torneo_id' });
Venta.belongsTo(Complejo, { foreignKey: 'complejo_id' });
Venta.belongsTo(User, { foreignKey: 'created_by', as: 'vendedor' });

Venta.hasMany(VentaItem, { foreignKey: 'venta_id', as: 'items' });
VentaItem.belongsTo(Venta, { foreignKey: 'venta_id' });
VentaItem.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });

// Gastos
Gasto.belongsTo(Caja, { foreignKey: 'caja_id' });
Caja.hasMany(Gasto, { foreignKey: 'caja_id', as: 'gastos' });
Gasto.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Devoluciones
Devolucion.belongsTo(Caja, { foreignKey: 'caja_id' });
Caja.hasMany(Devolucion, { foreignKey: 'caja_id', as: 'devoluciones' });
Devolucion.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Devolucion.hasMany(DevolucionItem, { foreignKey: 'devolucion_id', as: 'items' });
DevolucionItem.belongsTo(Devolucion, { foreignKey: 'devolucion_id' });
DevolucionItem.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });

// Movimientos
MovimientoStock.belongsTo(Producto, { foreignKey: 'producto_id' });
MovimientoStock.belongsTo(Complejo, { foreignKey: 'complejo_id' });
MovimientoStock.belongsTo(Torneo, { foreignKey: 'torneo_id' });
MovimientoStock.belongsTo(User, { foreignKey: 'created_by' });

module.exports = {
    sequelize,
    User,
    Complejo,
    Producto,
    InventarioGeneral,
    InventarioComplejo,
    NotaCompra,
    NotaCompraItem,
    OrdenTransferencia,
    OrdenTransferenciaItem,
    Torneo,
    Caja,
    Venta,
    VentaItem,
    MovimientoStock,
    Gasto,
    Devolucion,
    DevolucionItem
};
