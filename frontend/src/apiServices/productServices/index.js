import * as request from '~/utils/request';

export const getProduct = async (id) => {
    try {
        const res = await request.getMethod('Products/' + id);
        console.log(res);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}
export const getAllProducts = async () => {
    try {
        const res = await request.getMethod('Products');

        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const UpdateProduct = async (obj) => {
    try {
        const res = await request.putMethod('Products', obj);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}