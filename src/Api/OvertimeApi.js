import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

const GetOvertimeApi = async (name, status, date) => {
    try {
        const response = await axios.get(
            `${API_URL}/RequestOverTime/get-all-request-over-time?nameSearch=${name}&status=${status}&month=${date}`
        )
        return response.data
    } catch (error) {
        throw error
    }
}

export const GetOvertimeByIdApi = async (id) => {
    try {
        const response = await axios.get(
            `${API_URL}/RequestOverTime/get-request-over-time-of-employee?employeeId=${id}`
        )
        return response.data
    } catch (error) {
        throw error
    }
}
export const GetWorkDateSettingByIdApi = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/RequestLeave/get-work-date-setting-of-employee?employeeId=${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}
export const GetOvertimeTypeApi = async () => {
    try {
        const response = await axios.get(`${API_URL}/LeaveType/get-all-leave-type`)
        return response.data
    } catch (error) {
        throw error
    }
}
export const PostOvertimeApi = async (id, body) => {
    try {
        const response = await axios.post(
            `${API_URL}/RequestOverTime/create-request-over-time-of-employee?employeeId=${id}`,
            body
        )
        return response.data
    } catch (error) {
        throw error
    }
}

export const PutOvertimeApi = async (id, body) => {
    try {
        const response = await axios.patch(
            `${API_URL}/RequestOverTime/edit-request-over-time-of-employee?employeeId=${id}`,
            body
        )
        return response.data
    } catch (error) {
        throw error
    }
}

export const DeleteOvertimeApi = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/Overtimes/${id}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export default GetOvertimeApi
