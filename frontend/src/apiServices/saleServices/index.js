import * as request from '~/utils/request';

export const getAllSalesOrders = async () => {
    try {
        const res = await request.getMethod('SalesOrders');

        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const getSalesOrder = async (id) => {
    try {
        const res = await request.getMethod('SalesOrders/' + id);
        console.log(res);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}