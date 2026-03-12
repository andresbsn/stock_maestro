import api from './api';

const ventasService = {
    getAll: async (filters = {}) => {
        const response = await api.get('/ventas', { params: filters });
        return response.data;
    },

    create: async (payload) => {
        // payload: { caja_id, items: [...], metodo_pago, ... }
        const response = await api.post('/ventas', payload);
        return response.data;
    }
};

export default ventasService;
