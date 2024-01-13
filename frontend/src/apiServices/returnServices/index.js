import * as request from '~/utils/request';

export const getAllReturns = async (params) => {
    try {
        const response = await request.getMethod('ReturnOrders?', {
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

export const getReturn = async (id) => {
    try {
        const res = await request.getMethod('ReturnOrders/' + id);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const getNewReturn = async (id) => {
    try {
        const res = await request.getMethod('ReturnOrders/init/' + id, {}, true);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}


export const createReturn = async (obj) => {
    try {
        const res = await request.postMethod('ReturnOrders', obj);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

