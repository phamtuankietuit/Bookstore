import * as request from '~/utils/request';

export const getToday = async () => {
    try {
        const res = await request.getMethod('Reports/today');
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const getMoney = async (params) => {
    try {
        const response = await request.getMethod('Reports/money', {
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

export const getOrderCounts = async (params) => {
    try {
        const response = await request.getMethod('Reports/orderCount', {
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
};

export const getTopProducts = async (params) => {
    try {
        const response = await request.getMethod('Reports/topProducts', {
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