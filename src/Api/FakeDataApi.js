import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL
export const PostGenerationDataEmployeeApi = async (id) => {
    try {
        const response = await axios.post(
            `${API_URL}/FakeData/create-multiple-employee-account-of-department?DepartmentId=${id}`
        )
        return response.data
    } catch (error) {
        //throw error
    }
}
export const PostGenerationDataCheckInApi = async (id, std, end) => {
    try {
        const response = await axios.patch(
            `${API_URL}/FakeData/generate-checkin-checkout-workslot-employee?departmentId=${id}&startDateStr=${std}&endDateStr=${end}`
        )
        return response.data
    } catch (error) {
        //throw error
    }
}
