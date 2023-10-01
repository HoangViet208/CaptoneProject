import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

export const GetWorkedSlotByIdEmployeeApi = async (id) => {
    try {
        const response = await axios.get(
            `${API_URL}/WorkSlotEmployee/get-workslot-employee-by-employee-id?employeeId=${id}`
        )
        return response.data
    } catch (error) {
        throw error
    }
}
export const GetWorkedSlotByIdDepartmentApi = async (id, startTime, endTime) => {
    try {
        const response = await axios.get(
            `${API_URL}/WorkSlotEmployee/get-workslot-employee-by-department-id?departmentId=${id}&startTime=${startTime}&endTime=${endTime}`
        )
        return response.data
    } catch (error) {
        throw error
    }
}
export const GetWorkedSlotExcelApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/WorkSlotEmployee/export-excel-file?departmentId=${id}`, {
            responseType: 'blob', // Xác định kiểu dữ liệu là blob
        })
        return response.data
    } catch (error) {
        throw error
    }
}
