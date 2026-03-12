import api from './api';

const reportesService = {
    getUsuarioCaja: async () => {
        const response = await api.get('/reportes/usuario/caja');
        return response.data;
    },
    getAdmin: async (params = {}) => {
        const response = await api.get('/reportes/admin', { params });
        return response.data;
    }
};

export default reportesService;
