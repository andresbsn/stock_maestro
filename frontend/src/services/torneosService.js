import api from './api';

const torneosService = {
    getAll: async () => {
        const response = await api.get('/torneos');
        return response.data;
    },

    getActive: async () => {
        const response = await api.get('/torneos/active');
        return response.data;
    },

    create: async (payload) => {
        const response = await api.post('/torneos', payload);
        return response.data;
    },

    update: async (id, payload) => {
        const response = await api.put(`/torneos/${id}`, payload);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/torneos/${id}`);
        return response.data;
    }
};

export default torneosService;
