import api from './api';

const comprasService = {
    getAll: async () => {
        const response = await api.get('/compras/notas');
        return response.data;
    },

    create: async (payload) => {
        // payload: { proveedor, observaciones, items: [{ producto_id, quantity, cost }] }
        const response = await api.post('/compras/notas', payload);
        return response.data;
    }
};

export default comprasService;
