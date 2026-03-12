import api from './api';

const cajasService = {
    abrir: async (data) => {
        // data: { torneoId, complejoId, montoInicial }
        const response = await api.post('/cajas/abrir', data);
        return response.data;
    },

    cerrar: async (id, montoFinal) => {
        const response = await api.post(`/cajas/${id}/cerrar`, { montoFinal });
        return response.data;
    },

    getActive: async (params) => {
        // params: { complejoId?, torneoId? }
        const response = await api.get('/cajas/active', { params });
        return response.data;
    },

    getAll: async () => {
        const response = await api.get('/cajas');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/cajas/${id}`);
        return response.data;
    }
};

export default cajasService;
