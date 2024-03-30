import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

export const GetAllRequestApi = async (id) => {
    try {
        const response = await axios.get(
            `${API_URL}/Request/get-all-request-type-of-employee?employeeId=${id}`
        )
        return response.data
    } catch (error) {
        throw error
    }
}


