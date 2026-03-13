import api from './api';

const getAll = async () => {
    const response = await api.get('/complejos');
    return response.data;
};

const create = async (data) => {
    const response = await api.post('/complejos', data);
    return response.data;
};

const update = async (id, data) => {
    const response = await api.put(`/complejos/${id}`, data);
    return response.data;
};

const remove = async (id) => {
    const response = await api.delete(`/complejos/${id}`);
    return response.data;
};

export default {
    getAll,
    create,
    update,
    remove
};
