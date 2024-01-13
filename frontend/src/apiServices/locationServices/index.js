import * as request from '~/utils/request';

export const getStore = async () => {
    try {
        const res = await request.getMethod('Locations');
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const updateStore = async (id, obj) => {
    try {
        const res = await request.putMethod('Locations/' + id, obj);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}
