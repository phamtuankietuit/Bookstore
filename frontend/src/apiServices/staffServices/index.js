import * as request from '~/utils/request';

export const getAllStaffs = async (pageNumber, pageSize) => {
    try {
        const res = await request.getMethod(`Staffs?pageSize=${pageSize}&pageNumber=${pageNumber}`);
        return res;
    } catch (error) {
        return Promise.reject(error);
    }
}