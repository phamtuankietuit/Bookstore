import * as request from '~/utils/request';

export const Login = async (obj) => {
    try {
        const res = await request.postMethod('Account/login', obj);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}