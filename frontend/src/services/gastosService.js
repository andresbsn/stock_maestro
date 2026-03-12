import api from './api';

const gastosService = {
    getAll: async (params = {}) => {
        const response = await api.get('/gastos', { params });
        return response.data;
    },

    create: async (payload) => {
        const response = await api.post('/gastos', payload);
        return response.data;
    }
};

export default gastosService;
