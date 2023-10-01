import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import GetDepartmentApi, {
    GetDepartmentByIdApi,
    DeleteDepartmentApi,
    PostDepartmentApi,
    PutDepartmentApi,
    GetDepartmentWithoutApi,
} from '../../Api/DepartmentApi'

const initialState = {
    DepartmentList: [],
    DepartmentWithoutList: [],
    DepartmentDetail: [],
}

const authSlice = createSlice({
    name: 'Department',
    initialState,
    reducers: {
        clearDepartment: (state, action) => {
            state.DepartmentDetail = []
            state.DepartmentList = []
            state.DepartmentWithoutList = []
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDepartmentAsyncApi.pending, (state) => {})
            .addCase(getDepartmentAsyncApi.fulfilled, (state, action) => {
                state.DepartmentList = action.payload
            })
            .addCase(getDepartmentAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(GetDepartmentWithoutAsyncApi.pending, (state) => {})
            .addCase(GetDepartmentWithoutAsyncApi.fulfilled, (state, action) => {
                state.DepartmentWithoutList = action.payload
            })
            .addCase(GetDepartmentWithoutAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(getDepartmentByIdAsyncApi.pending, (state) => {})
            .addCase(getDepartmentByIdAsyncApi.fulfilled, (state, action) => {
                state.DepartmentDetail = action.payload
            })
            .addCase(getDepartmentByIdAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(PostDepartmentAsyncApi.pending, (state) => {})
            .addCase(PostDepartmentAsyncApi.fulfilled, (state, action) => {})
            .addCase(PostDepartmentAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(PutDepartmentAsyncApi.pending, (state) => {})
            .addCase(PutDepartmentAsyncApi.fulfilled, (state, action) => {})
            .addCase(PutDepartmentAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(DeleteDepartmentAsyncApi.pending, (state) => {})
            .addCase(DeleteDepartmentAsyncApi.fulfilled, (state, action) => {})
            .addCase(DeleteDepartmentAsyncApi.rejected, (state, action) => {})
    },
})

export default authSlice.reducer
export const DepartmentAction = authSlice.actions

export const getDepartmentAsyncApi = createAsyncThunk('DepartmentReducer/getAsyncApi', async () => {
    try {
        const response = await GetDepartmentApi()
        return response.data
    } catch (error) {
        const json = error.response.data
        const errors = json[''].errors
        throw errors[0].errorMessage
    }
})
export const GetDepartmentWithoutAsyncApi = createAsyncThunk('DepartmentReducer/GetDepartmentWithoutApi', async () => {
    try {
        const response = await GetDepartmentWithoutApi()
        return response
    } catch (error) {
        const json = error.response.data
        const errors = json[''].errors
        throw errors[0].errorMessage
    }
})
export const getDepartmentByIdAsyncApi = createAsyncThunk('DepartmentReducer/getByIdAsyncApi', async (id) => {
    try {
        const response = await GetDepartmentByIdApi(id)
        return response
    } catch (error) {
        const json = error.response.data
        const errors = json[''].errors
        throw errors[0].errorMessage
    }
})
export const PostDepartmentAsyncApi = createAsyncThunk('DepartmentReducer/postAsyncApi', async (body) => {
    try {
        const response = await PostDepartmentApi(body)
        return response
    } catch (error) {
        const json = error.response.data
        const errors = json[''].errors
        throw errors[0].errorMessage
    }
})
export const PutDepartmentAsyncApi = createAsyncThunk('DepartmentReducer/putAsyncApi', async (body) => {
    try {
        const response = await PutDepartmentApi(body)
        return response.data // Trả về dữ liệu từ response nếu thành công
    } catch (error) {
        const json = error.response.data
        const errors = json[''].errors
        throw errors[0].errorMessage
    }
})
export const DeleteDepartmentAsyncApi = createAsyncThunk('DepartmentReducer/deleteAsyncApi', async (body) => {
    try {
        const response = await DeleteDepartmentApi(body)
        return response
    } catch (error) {
        const json = error.response.data
        const errors = json[''].errors
        throw errors[0].errorMessage
    }
})
