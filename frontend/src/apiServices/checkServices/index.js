import * as request from '~/utils/request';

export const getChecks = async (params) => {
    try {
        const response = await request.getMethod('AdjustmentTickets?', {
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

export const createCheck = async (obj) => {
    try {
        const response = await request.postMethod('AdjustmentTickets', obj);
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const getCheck = async (id) => {
    try {
        const response = await request.getMethod('AdjustmentTickets/' + id);
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const updateCheck = async (id, obj) => {
    try {
        const response = await request.putMethod('AdjustmentTickets/' + id, obj);
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
}