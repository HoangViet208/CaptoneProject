import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import GetWorkedApi, {
    GetWorkedByIdApi,
    DeleteWorkedApi,
    PostWorkedApi,
    PutWorkedApi,
    GetWorkedTypeApi,
    GetWorkDateSettingByIdApi,
    GetWorkedSlotApi,
    PostWorkedSlotApi,
    PostWorkedSlotEmployeeApi,
    PostWorkEmployeeByDepartmentApi,
    PutApproveWorkedApi,
    PutRejectWorkedApi,
    PutCancelWorkedApi,
} from '../../Api/WorkedApi'

const initialState = {
    loading: false,
    valueTabs: 0,
    WorkedList: [],
    WorkedTypeList: ['Casual Leave', 'Sick Leave'],
    WorkedByEmployee: [],
    WorkedSlot: [],
    WorkSetting: [],
}

const authSlice = createSlice({
    name: 'Worked',
    initialState,
    reducers: {
        clearWorked: (state, action) => {
            state.WorkedByEmployee = []
            state.WorkedList = []
            state.WorkedTypeList = ['Casual Leave', 'Sick Leave']
            state.WorkSetting = []
        },
        ChangeTab: (state, action) => {
            console.log('action', action)
            state.valueTabs = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getWorkedAsyncApi.pending, (state) => {
                state.loading = true
            })
            .addCase(getWorkedAsyncApi.fulfilled, (state, action) => {
                state.WorkedList = action.payload
                state.loading = false
            })
            .addCase(getWorkedAsyncApi.rejected, (state, action) => {
                state.loading = false
            })
        builder
            .addCase(GetWorkedSlotAsyncApi.pending, (state) => {
                state.loading = true
            })
            .addCase(GetWorkedSlotAsyncApi.fulfilled, (state, action) => {
                state.WorkedSlot = action.payload
                state.loading = false
            })
            .addCase(GetWorkedSlotAsyncApi.rejected, (state, action) => {
                state.loading = false
            })
        builder
            .addCase(GetWorkDateSettingByIdAsyncApi.pending, (state) => {})
            .addCase(GetWorkDateSettingByIdAsyncApi.fulfilled, (state, action) => {
                state.WorkSetting = action.payload
            })
            .addCase(GetWorkDateSettingByIdAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(getWorkedByIdAsyncApi.pending, (state) => {
                state.loading = true
            })
            .addCase(getWorkedByIdAsyncApi.fulfilled, (state, action) => {
                state.WorkedByEmployee = action.payload
                state.loading = false
            })
            .addCase(getWorkedByIdAsyncApi.rejected, (state, action) => {
                state.loading = false
            })
        builder
            .addCase(GetWorkedTypeAsyncApi.pending, (state) => {})
            .addCase(GetWorkedTypeAsyncApi.fulfilled, (state, action) => {
                state.WorkedTypeList = action.payload
            })
            .addCase(GetWorkedTypeAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(PostWorkedAsyncApi.pending, (state) => {})
            .addCase(PostWorkedAsyncApi.fulfilled, (state, action) => {})
            .addCase(PostWorkedAsyncApi.rejected, (state, action) => {})

        builder
            .addCase(PostWorkedSlotEmployeeAsyncApi.pending, (state) => {})
            .addCase(PostWorkedSlotEmployeeAsyncApi.fulfilled, (state, action) => {})
            .addCase(PostWorkedSlotEmployeeAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(PostWorkedSlotAsyncApi.pending, (state) => {})
            .addCase(PostWorkedSlotAsyncApi.fulfilled, (state, action) => {})
            .addCase(PostWorkedSlotAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(PostWorkEmployeeByDepartmentAsyncApi.pending, (state) => {})
            .addCase(PostWorkEmployeeByDepartmentAsyncApi.fulfilled, (state, action) => {})
            .addCase(PostWorkEmployeeByDepartmentAsyncApi.rejected, (state, action) => {})

        builder
            .addCase(PutWorkedAsyncApi.pending, (state) => {})
            .addCase(PutWorkedAsyncApi.fulfilled, (state, action) => {})
            .addCase(PutWorkedAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(PutApproveWorkedAsyncApi.pending, (state) => {})
            .addCase(PutApproveWorkedAsyncApi.fulfilled, (state, action) => {})
            .addCase(PutApproveWorkedAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(PutRejectWorkedAsyncApi.pending, (state) => {})
            .addCase(PutRejectWorkedAsyncApi.fulfilled, (state, action) => {})
            .addCase(PutRejectWorkedAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(PutCancelWorkedAsyncApi.pending, (state) => {})
            .addCase(PutCancelWorkedAsyncApi.fulfilled, (state, action) => {})
            .addCase(PutCancelWorkedAsyncApi.rejected, (state, action) => {})
        builder
            .addCase(DeleteWorkedAsyncApi.pending, (state) => {})
            .addCase(DeleteWorkedAsyncApi.fulfilled, (state, action) => {})
            .addCase(DeleteWorkedAsyncApi.rejected, (state, action) => {})
    },
})

export default authSlice.reducer
export const WorkedAction = authSlice.actions

export const getWorkedAsyncApi = createAsyncThunk('WorkedReducer/getAsyncApi', async ({ name, status, date }) => {
    try {
        const response = await GetWorkedApi(name, status, date)
        return response
    } catch (error) {
        const json = error.response.data
        const errors = json[''].errors
        throw errors[0].errorMessage
    }
})

export const GetWorkedSlotAsyncApi = createAsyncThunk('WorkedReducer/GetWorkedSlotAsyncApi', async ({ id, month }) => {
    try {
        const response = await GetWorkedSlotApi(id, month)
        return response
    } catch (error) {
        const json = error.response.data
        const errors = json[''].errors
        throw errors[0].errorMessage
    }
})

export const GetWorkDateSettingByIdAsyncApi = createAsyncThunk(
    'WorkedReducer/GetWorkDateSettingByIdApi',
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
export const GetWorkedTypeAsyncApi = createAsyncThunk('WorkedReducer/GetWorkedTypeApi', async (id) => {
    try {
        const response = await GetWorkedTypeApi()
        return response
    } catch (error) {
        const json = error.response.data
        const errors = json[''].errors
        throw errors[0].errorMessage
    }
})
export const getWorkedByIdAsyncApi = createAsyncThunk(
    'WorkedReducer/getByIdAsyncApi',
    async ({ id, isWorkLate, isLeaveSoon, isNotCheckIn, isNotCheckOut }) => {
        try {
            const response = await GetWorkedByIdApi(id, isWorkLate, isLeaveSoon, isNotCheckIn, isNotCheckOut)
            return response
        } catch (error) {
            const json = error.response.data
            const errors = json[''].errors
            throw errors[0].errorMessage
        }
    }
)
export const PostWorkedAsyncApi = createAsyncThunk('WorkedReducer/postAsyncApi', async ({ id, body }) => {
    try {
        console.log('thanh cong1', id, body)
        const response = await PostWorkedApi(id, body)
        return response
    } catch (error) {
        const json = error.response.data
        const errors = json[''].errors
        throw errors[0].errorMessage
    }
})
export const PostWorkedSlotAsyncApi = createAsyncThunk('WorkedReducer/PostWorkedSlotAsyncApi', async (body) => {
    try {
        console.log('thanh cong1')
        const response = await PostWorkedSlotApi(body)
        return response
    } catch (error) {
        const json = error.response.data
        const errors = json[''].errors
        throw errors[0].errorMessage
    }
})
export const PostWorkedSlotEmployeeAsyncApi = createAsyncThunk(
    'WorkedReducer/PostWorkedSlotEmployeeAsyncApi',
    async (body) => {
        try {
            console.log('thanh cong1')
            const response = await PostWorkedSlotEmployeeApi(body)
            return response
        } catch (error) {
            const json = error.response.data
            const errors = json[''].errors
            throw errors[0].errorMessage
        }
    }
)
export const PostWorkEmployeeByDepartmentAsyncApi = createAsyncThunk(
    'WorkedReducer/PostWorkEmployeeByDepartmentAsyncApi',
    async ({ id, body }) => {
        try {
            console.log('thanh cong1')
            const response = await PostWorkEmployeeByDepartmentApi(id, body)
            return response
        } catch (error) {
            const json = error.response.data
            const errors = json[''].errors
            throw errors[0].errorMessage
        }
    }
)

export const PutWorkedAsyncApi = createAsyncThunk('WorkedReducer/putAsyncApi', async ({ id, body }) => {
    try {
        const response = await PutWorkedApi(id, body)
        return response.data // Trả về dữ liệu từ response nếu thành công
    } catch (error) {
        const json = error.response.data
        const errors = json[''].errors
        throw errors[0].errorMessage
    }
})
export const PutApproveWorkedAsyncApi = createAsyncThunk('WorkedReducer/PutApproveWorkedApi', async (id) => {
    try {
        const response = await PutApproveWorkedApi(id)
        return response
    } catch (error) {
        const json = error.response.data
        const errors = json[''].errors
        throw errors[0].errorMessage
    }
})
export const PutRejectWorkedAsyncApi = createAsyncThunk('WorkedReducer/PutRejectWorkedApi', async (body) => {
    try {
        const response = await PutRejectWorkedApi(body)
        return response
    } catch (error) {
        const json = error.response.data
        const errors = json[''].errors
        throw errors[0].errorMessage
    }
})
export const PutCancelWorkedAsyncApi = createAsyncThunk('WorkedReducer/PutCancelWorkedApi', async (body) => {
    try {
        const response = await PutCancelWorkedApi(body)
        return response
    } catch (error) {
        const json = error.response.data
        const errors = json[''].errors
        throw errors[0].errorMessage
    }
})
export const DeleteWorkedAsyncApi = createAsyncThunk('WorkedReducer/deleteAsyncApi', async (id) => {
    try {
        const response = await DeleteWorkedApi(id)
        return response
    } catch (error) {
        const json = error.response.data
        const errors = json[''].errors
        throw errors[0].errorMessage
    }
})
