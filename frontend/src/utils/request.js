import axios from 'axios';
import { getLocalStorage } from '~/store/getLocalStorage';

const request = axios.create({
    baseURL: 'https://api-bookstore-y1s1.azurewebsites.net/api/',
});

export const getMethod = async (path, options = {}, hasAuth = false) => {
    const headers = {
        staffId: getLocalStorage().user.staffId,
    };

    if (hasAuth === true) {
        options.headers = headers;
    }

    // console.log('options', options);
    // console.log('HEADERS', headers);

    const response = await request.get(path, options);

    return response.data;
};

export const postMethod = async (path, options = {}, loginRequest) => {
    const headers = {};

    if (!loginRequest) {
        headers.staffId = getLocalStorage().user.staffId;
    }

    // console.log('HEADERS', headers);

    const response = await request.post(path, options, {
        headers: headers,
    });

    return response.data;
};

export const putMethod = async (path, options = {}, staffId) => {
    const headers = {};

    if (staffId) {
        headers.staffId = staffId;
    } else {
        headers.staffId = getLocalStorage().user.staffId;
    }

    const response = await request.put(path, options, {
        headers: headers,
    });
    return response.data;
};

export const deleteMethod = async (path) => {
    const response = await request.delete(path, {
        headers: {
            'staffId': getLocalStorage().user.staffId,
        }
    });
    return response.data;
};

export default request;