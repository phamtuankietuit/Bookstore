import * as request from '~/utils/request';

export const getAllProductTypes = async () => {
    try {
        const res = await request.getMethod('Categories');

        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const createProductType = async (type) => {
    try {
        const res = await request.postMethod('Categories', type);

        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}
