const { Producto, InventarioGeneral, InventarioComplejo } = require('../models');

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
        const producto = await Producto.create(req.body);
        // Init General Stock 0
        await InventarioGeneral.create({ producto_id: producto.id, stock: 0 });
        res.json({ ok: true, data: producto });
    } catch (error) {
        res.status(400).json({ ok: false, error: { message: error.message } });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Producto.update(req.body, { where: { id } });
        if (!updated) {
            return res.status(404).json({ ok: false, error: { message: 'Producto no encontrado' } });
        }
        const producto = await Producto.findByPk(id);
        res.json({ ok: true, data: producto });
    } catch (error) {
        res.status(400).json({ ok: false, error: { message: error.message } });
    }
};
