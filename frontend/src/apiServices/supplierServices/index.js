import * as request from '~/utils/request';

export const getAllSuppliers = async (pageNumber, pageSize) => {
    try {
        const res = await request.getMethod(`Suppliers?pageSize=${pageSize}&pageNumber=${pageNumber}&sortBy=categoryId&orderBy=asc`);

        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const getAllSupplierGroups = async (pageNumber, pageSize) => {
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

export const DeleteSupplier = async (id) => {
    try {
        const res = await request.deleteMethod('Suppliers/' + id);
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