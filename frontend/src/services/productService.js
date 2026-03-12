import api from './api';

const productService = {
    getAll: async () => {
        const response = await api.get('/productos');
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/productos', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/productos/${id}`, data);
        return response.data;
    }
};

export default productService;
