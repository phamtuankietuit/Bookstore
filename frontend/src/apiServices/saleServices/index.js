import * as request from '~/utils/request';

export const getAllSalesOrders = async (params) => {
    try {
        const response = await request.getMethod('SalesOrders?', {
            params,
            paramsSerializer: (params) => {
                const serializedParams = Object.keys(params).map((key) => {
                    return key + '=' + params[key];
                }).join('&');

                console.log(serializedParams);

                return serializedParams;
            },
        });

        return response;
    } catch (error) {
        return Promise.reject(error);
    }
}


export const CreateSalesOrders = async (obj) => {
    try {
        const res = await request.postMethod('SalesOrders', obj);

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

export const UpdateSalesOrder = async (id, obj) => {
    try {
        const res = await request.putMethod('SalesOrders/' + id, obj);
        console.log(res);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}