import api from './api';

const devolucionesService = {
    getAll: async (params = {}) => {
        const response = await api.get('/devoluciones', { params });
        return response.data;
    },

    create: async (payload) => {
        const response = await api.post('/devoluciones', payload);
        return response.data;
    }
};

export default devolucionesService;
