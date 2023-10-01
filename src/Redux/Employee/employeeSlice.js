import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import GetEmployeeApi, {
    GetEmployeeByIdApi,
    DeleteEmployeeApi,
    PostEmployeeApi,
    PutEmployeeApi,
} from '../../Api/EmployeeApi'

const initialState = {
    EmployeeList: [],
    EmployeeDetail: {},
}

const authSlice = createSlice({
    name: 'Employee',
    initialState,
    reducers: {
        clearEmployee: (state, action) => {
            state.EmployeeDetail = {}
            state.EmployeeList = []
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getEmployeeAsyncApi.pending, (state) => {})
            .addCase(getEmployeeAsyncApi.fulfilled, (state, action) => {
                state.EmployeeList = action.payload
            })
            .addCase(getEmployeeAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(getEmployeeByIdAsyncApi.pending, (state) => {})
            .addCase(getEmployeeByIdAsyncApi.fulfilled, (state, action) => {
                state.EmployeeDetail = action.payload
            })
            .addCase(getEmployeeByIdAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(PostEmployeeAsyncApi.pending, (state) => {})
            .addCase(PostEmployeeAsyncApi.fulfilled, (state, action) => {})
            .addCase(PostEmployeeAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(PutEmployeeAsyncApi.pending, (state) => {})
            .addCase(PutEmployeeAsyncApi.fulfilled, (state, action) => {})
            .addCase(PutEmployeeAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(DeleteEmployeeAsyncApi.pending, (state) => {})
            .addCase(DeleteEmployeeAsyncApi.fulfilled, (state, action) => {})
            .addCase(DeleteEmployeeAsyncApi.rejected, (state, action) => {})
    },
})

export default authSlice.reducer
export const EmployeeAction = authSlice.actions

export const getEmployeeAsyncApi = createAsyncThunk(
    'EmployeeReducer/getAsyncApi',
    async ({ roleId, departmentId, name }) => {
        try {
            const response = await GetEmployeeApi(roleId, departmentId, name)
            return response
        } catch (error) {
            const json = error.response.data
            const errors = json[''].errors
            throw errors[0].errorMessage
        }
    }
)
export const getEmployeeByIdAsyncApi = createAsyncThunk('EmployeeReducer/getByIdAsyncApi', async (id) => {
    try {
        const response = await GetEmployeeByIdApi(id)
        return response
    } catch (error) {
        const json = error.response.data
        const errors = json[''].errors
        throw errors[0].errorMessage
    }
})
export const PostEmployeeAsyncApi = createAsyncThunk('EmployeeReducer/postAsyncApi', async (body) => {
    try {
        const response = await PostEmployeeApi(body)
        return response
    } catch (error) {
        const json = error.response.data
        const errors = json[''].errors
        throw errors[0].errorMessage
    }
})
export const PutEmployeeAsyncApi = createAsyncThunk('EmployeeReducer/putAsyncApi', async (body) => {
    try {
        const response = await PutEmployeeApi(body)
        return response.data // Trả về dữ liệu từ response nếu thành công
    } catch (error) {
        const json = error.response.data
        const errors = json[''].errors
        throw errors[0].errorMessage
    }
})
export const DeleteEmployeeAsyncApi = createAsyncThunk('EmployeeReducer/deleteAsyncApi', async (body) => {
    try {
        const response = await DeleteEmployeeApi(body)
        return response
    } catch (error) {
        const json = error.response.data
        const errors = json[''].errors
        throw errors[0].errorMessage
    }
})
