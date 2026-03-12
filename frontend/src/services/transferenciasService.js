import api from './api';

const transferenciasService = {
    getAll: async () => {
        const response = await api.get('/transferencias/ordenes');
        return response.data;
    },

    create: async (payload) => {
        // payload: { complejo_id, items: [{ producto_id, quantity }] }
        const response = await api.post('/transferencias/ordenes', payload);
        return response.data;
    },

    confirmar: async (id) => {
        const response = await api.post(`/transferencias/ordenes/${id}/confirmar`);
        return response.data;
    },

    update: async (id, payload) => {
        const response = await api.put(`/transferencias/ordenes/${id}`, payload);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/transferencias/ordenes/${id}`);
        return response.data;
    }
};

export default transferenciasService;
