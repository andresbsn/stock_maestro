const { Producto, InventarioGeneral, InventarioComplejo, sequelize } = require('../models');

exports.getAll = async (req, res) => {
    try {
        const { role, complejo_id } = req.user;
        let options = {
            include: [],
            order: [['nombre', 'ASC']]
        };

        if (role === 'ADMIN') {
            options.include.push({
                model: InventarioGeneral,
                as: 'stockGeneral'
            });
        } else if (role === 'COMPLEJO') {
            options.where = { solo_admin: false };
            options.include.push({
                model: InventarioComplejo,
                required: false, // Show products even if no stock record exists yet
                where: { complejo_id: complejo_id }
            });
        }

        const productos = await Producto.findAll(options);

        // Transform to flat 'stock' property for frontend convenience
        const data = productos.map(p => {
            const json = p.toJSON();
            let stock = 0;
            if (role === 'ADMIN') {
                stock = json.stockGeneral ? json.stockGeneral.stock : 0;
            } else {
                // Since it's a hasMany, but we filtered by specific complex ID, it might come as an array or single object depending on association
                // Defined as hasMany in models/index.js line 26: Producto.hasMany(InventarioComplejo)
                // So it will be an array
                stock = json.InventarioComplejos && json.InventarioComplejos.length > 0
                    ? json.InventarioComplejos[0].stock
                    : 0;
            }
            return { ...json, stock };
        });

        res.json({ ok: true, data });
    } catch (error) {
        res.status(500).json({ ok: false, error: { message: error.message } });
    }
};

exports.create = async (req, res) => {
    try {
        // Sanitize numeric fields: empty string -> 0
        if (req.body.costo_unitario === "") req.body.costo_unitario = 0;
        if (req.body.precio_venta_unitario === "") req.body.precio_venta_unitario = 0;

        const producto = await Producto.create(req.body);
        // Init General Stock 0
        await InventarioGeneral.create({ producto_id: producto.id, stock: 0 });
        res.json({ ok: true, data: producto });
    } catch (error) {
        res.status(400).json({ ok: false, error: { message: error.message } });
    }
};

exports.update = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        
        // Sanitize numeric fields: empty string -> 0
        if (req.body.costo_unitario === "") req.body.costo_unitario = 0;
        if (req.body.precio_venta_unitario === "") req.body.precio_venta_unitario = 0;
        if (req.body.stock === "") req.body.stock = 0;

        const { stock, ...productoData } = req.body;
        
        const [updated] = await Producto.update(productoData, { where: { id }, transaction: t });
        
        // Even if product wasn't updated (e.g. no changes in product fields), we might want to update stock.
        // But usually update returns 0 if no rows affected.
        // If the ID doesn't exist, it returns 0.
        // Let's check if product exists first or rely on update result. 
        // However, if we only update stock and not product fields, update() might return 0 if no fields changed.
        // Better to check existence or just proceed if we are sure ID is valid.
        
        const producto = await Producto.findByPk(id, { transaction: t });
        if (!producto) {
            await t.rollback();
            return res.status(404).json({ ok: false, error: { message: 'Producto no encontrado' } });
        }

        // Update stock if provided and user is ADMIN
        if (req.user.role === 'ADMIN' && stock !== undefined && stock !== null) {
             let inventario = await InventarioGeneral.findOne({ where: { producto_id: id }, transaction: t });
             if (inventario) {
                 inventario.stock = stock;
                 await inventario.save({ transaction: t });
             } else {
                 await InventarioGeneral.create({ producto_id: id, stock: stock }, { transaction: t });
             }
        }
        
        // If there were changes to product data, apply them (though we did update above)
        // actually update() above handled productData.
        
        await t.commit();
        res.json({ ok: true, data: producto });
    } catch (error) {
        await t.rollback();
        res.status(400).json({ ok: false, error: { message: error.message } });
    }
};
