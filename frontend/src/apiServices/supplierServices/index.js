import * as request from '~/utils/request';

export const getAllSuppliers = async () => {
    try {
        const res = await request.getMethod('Suppliers');

        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}
