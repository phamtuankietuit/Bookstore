import * as request from '~/utils/request';

export const getAllPurchaseOrders = async () => {
    try {
        const res = await request.getMethod('PurchaseOrders');

        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const getPurchaseOrder = async (id) => {
    try {
        const res = await request.getMethod('PurchaseOrders/' + id);
        console.log(res);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}