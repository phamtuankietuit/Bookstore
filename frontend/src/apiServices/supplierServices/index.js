import * as request from '~/utils/request';

export const getAllSuppliers = async () => {
    try {
        const res = await request.getMethod('Suppliers');

        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const getAllSupplierGroups = async () => {
    try {
        const res = await request.getMethod('SupplierGroups');

        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}
export const getSupplier = async (id) => {
    try {
        const res = await request.getMethod('Suppliers/' + id);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const UpdateSupplier = async (id, obj) => {
    try {
        const res = await request.putMethod('Suppliers/' + id, obj);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const CreateSuppliers = async (obj) => {
    try {
        const res = await request.postMethod('Suppliers', obj);

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