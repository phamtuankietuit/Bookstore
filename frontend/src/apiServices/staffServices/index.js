import * as request from '~/utils/request';

export const getAllStaffs = async (params) => {
    try {
        const response = await request.getMethod('Staffs?', {
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

export const getStaff = async (id) => {
    try {
        const res = await request.getMethod('Staffs/' + id);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const createStaff = async (obj) => {
    try {
        const res = await request.postMethod('Staffs', obj);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}