import * as request from '~/utils/request';

export const login = async (params) => {
    try {
        const response = await request.postMethod('Account/login', {
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

export const Login = async (obj) => {
    try {
        const res = await request.postMethod('Account/login', obj, true);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const updatePassword = async (obj) => {
    try {
        const res = await request.putMethod('Account/updatePassword', obj);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const forgotPassword = async (obj) => {
    try {
        const res = await request.postMethod('Account/forgotPassword', obj, true);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}
