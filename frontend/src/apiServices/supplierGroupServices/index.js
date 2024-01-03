import * as request from '~/utils/request';

export const getAllSupplierGroups = async (pageNumber, pageSize) => {
    try {
        const res = await request.getMethod(`SupplierGroups?pageSize=${pageSize}&pageNumber=${pageNumber}`);

        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const CreateSupplierGroup = async (obj) => {
    try {
        const res = await request.postMethod('SupplierGroups', obj);

        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}