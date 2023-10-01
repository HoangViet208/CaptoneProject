import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import GetApplyLeaveApi, {
    GetApplyLeaveByIdApi,
    DeleteApplyLeaveApi,
    PostApplyLeaveApi,
    PutApplyLeaveApi,
    GetApplyLeaveTypeApi,
    GetWorkDateSettingByIdApi,
    PutApproveApplyLeaveApi,
    GetApplyLeaveByRequestIdApi,
} from '../../Api/ApplyLeaveApi'

const initialState = {
    loading: false,
    valueTabs: 0,
    ApplyLeaveList: [],
    ApplyLeaveTypeList: ['Casual Leave', 'Sick Leave'],
    ApplyLeaveByEmployee: [],
    WorkSetting: [],
}

const authSlice = createSlice({
    name: 'ApplyLeave',
    initialState,
    reducers: {
        clearApplyLeave: (state, action) => {
            state.ApplyLeaveByEmployee = []
            state.ApplyLeaveList = []
            state.ApplyLeaveTypeList = ['Casual Leave', 'Sick Leave']
            state.WorkSetting = []
        },
        ChangeTab: (state, action) => {
            console.log('action', action)
            state.valueTabs = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getApplyLeaveAsyncApi.pending, (state) => {
                state.loading = true
            })
            .addCase(getApplyLeaveAsyncApi.fulfilled, (state, action) => {
                state.loading = false
                state.ApplyLeaveList = action.payload
            })
            .addCase(getApplyLeaveAsyncApi.rejected, (state, action) => {
                state.loading = false
            })
        builder
            .addCase(GetApplyLeaveByRequestIdAsyncApi.pending, (state) => {
                state.loading = true
            })
            .addCase(GetApplyLeaveByRequestIdAsyncApi.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(GetApplyLeaveByRequestIdAsyncApi.rejected, (state, action) => {
                state.loading = false
            })
        builder
            .addCase(GetWorkDateSettingByIdAsyncApi.pending, (state) => {})
            .addCase(GetWorkDateSettingByIdAsyncApi.fulfilled, (state, action) => {
                state.WorkSetting = action.payload
            })
            .addCase(GetWorkDateSettingByIdAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(getApplyLeaveByIdAsyncApi.pending, (state) => {
                state.loading = true
            })
            .addCase(getApplyLeaveByIdAsyncApi.fulfilled, (state, action) => {
                state.loading = false
                state.ApplyLeaveByEmployee = action.payload
            })
            .addCase(getApplyLeaveByIdAsyncApi.rejected, (state, action) => {
                state.loading = false
            })
        builder
            .addCase(GetApplyLeaveTypeAsyncApi.pending, (state) => {})
            .addCase(GetApplyLeaveTypeAsyncApi.fulfilled, (state, action) => {
                state.ApplyLeaveTypeList = action.payload
            })
            .addCase(GetApplyLeaveTypeAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(PostApplyLeaveAsyncApi.pending, (state) => {})
            .addCase(PostApplyLeaveAsyncApi.fulfilled, (state, action) => {})
            .addCase(PostApplyLeaveAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(PutApplyLeaveAsyncApi.pending, (state) => {})
            .addCase(PutApplyLeaveAsyncApi.fulfilled, (state, action) => {})
            .addCase(PutApplyLeaveAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(PutApproveApplyLeaveAsyncApi.pending, (state) => {})
            .addCase(PutApproveApplyLeaveAsyncApi.fulfilled, (state, action) => {})
            .addCase(PutApproveApplyLeaveAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(DeleteApplyLeaveAsyncApi.pending, (state) => {})
            .addCase(DeleteApplyLeaveAsyncApi.fulfilled, (state, action) => {})
            .addCase(DeleteApplyLeaveAsyncApi.rejected, (state, action) => {})
    },
})

export default authSlice.reducer
export const ApplyLeaveAction = authSlice.actions

export const getApplyLeaveAsyncApi = createAsyncThunk('ApplyLeaveReducer/getAsyncApi', async ({ name, status }) => {
    try {
        const response = await GetApplyLeaveApi(name, status)
        return response
    } catch (error) {
        const json = error.response.data
        const errors = json[''].errors
        throw errors[0].errorMessage
    }
})

export const GetWorkDateSettingByIdAsyncApi = createAsyncThunk(
    'ApplyLeaveReducer/GetWorkDateSettingByIdApi',
    async (id) => {
        try {
            const response = await GetWorkDateSettingByIdApi(id)
            return response
        } catch (error) {
            const json = error.response.data
            const errors = json[''].errors
            throw errors[0].errorMessage
        }
    }
)
export const GetApplyLeaveTypeAsyncApi = createAsyncThunk('ApplyLeaveReducer/GetApplyLeaveTypeApi', async (id) => {
    try {
        const response = await GetApplyLeaveTypeApi()
        return response
    } catch (error) {
        const json = error.response.data
        const errors = json[''].errors
        throw errors[0].errorMessage
    }
})
export const getApplyLeaveByIdAsyncApi = createAsyncThunk('ApplyLeaveReducer/getByIdAsyncApi', async (id) => {
    try {
        const response = await GetApplyLeaveByIdApi(id)
        return response
    } catch (error) {
        const json = error.response.data
        const errors = json[''].errors
        throw errors[0].errorMessage
    }
})
export const GetApplyLeaveByRequestIdAsyncApi = createAsyncThunk(
    'ApplyLeaveReducer/GetApplyLeaveByRequestIdApi',
    async (id) => {
        try {
            const response = await GetApplyLeaveByRequestIdApi(id)
            return response
        } catch (error) {
            const json = error.response.data
            const errors = json[''].errors
            throw errors[0].errorMessage
        }
    }
)

export const PostApplyLeaveAsyncApi = createAsyncThunk('ApplyLeaveReducer/postAsyncApi', async ({ id, body }) => {
    try {
        console.log('thanh cong1', id, body)
        const response = await PostApplyLeaveApi(id, body)
        return response
    } catch (error) {
        const json = error.response.data
        const errors = json[''].errors
        throw errors[0].errorMessage
    }
})
export const PutApplyLeaveAsyncApi = createAsyncThunk('ApplyLeaveReducer/putAsyncApi', async ({ id, body }) => {
    try {
        const response = await PutApplyLeaveApi(id, body)
        return response.data // Trả về dữ liệu từ response nếu thành công
    } catch (error) {
        const json = error.response.data
        const errors = json[''].errors
        throw errors[0].errorMessage
    }
})

export const PutApproveApplyLeaveAsyncApi = createAsyncThunk(
    'ApplyLeaveReducer/PutApproveApplyLeaveApi',
    async (id) => {
        try {
            const response = await PutApproveApplyLeaveApi(id)
            return response.data // Trả về dữ liệu từ response nếu thành công
        } catch (error) {
            const json = error.response.data
            const errors = json[''].errors
            throw errors[0].errorMessage
        }
    }
)
export const DeleteApplyLeaveAsyncApi = createAsyncThunk('ApplyLeaveReducer/deleteAsyncApi', async (body) => {
    try {
        const response = await DeleteApplyLeaveApi(body)
        return response
    } catch (error) {
        const json = error.response.data
        const errors = json[''].errors
        throw errors[0].errorMessage
    }
})
