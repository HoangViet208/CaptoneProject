import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
    GetWorkedSlotByIdDepartmentApi,
    GetWorkedSlotByIdEmployeeApi,
    GetWorkedSlotExcelApi,
} from '../../Api/WorkSlotEmployeeApi'

const initialState = {
    WorkSlotByEmployee: [],
    WorkSlotByDepartment: [],
}

const authSlice = createSlice({
    name: 'WorkSlotEmployeeed',
    initialState,
    reducers: {
        clearWorkSlotEmployeeed: (state, action) => {
            state.WorkSlotByEmployee = []
            state.WorkSlotByDepartment = []
        },
        ChangeTab: (state, action) => {
            console.log('action', action)
            state.valueTabs = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getWorkSlotEmployeeedAsyncApi.pending, (state) => {
                state.loading = true
            })
            .addCase(getWorkSlotEmployeeedAsyncApi.fulfilled, (state, action) => {
                state.WorkSlotByEmployee = action.payload
                state.loading = false
            })
            .addCase(getWorkSlotEmployeeedAsyncApi.rejected, (state, action) => {
                state.loading = false
            })
        builder
            .addCase(GetWorkedSlotByIdDepartmentAsyncApi.pending, (state) => {
                state.loading = true
            })
            .addCase(GetWorkedSlotByIdDepartmentAsyncApi.fulfilled, (state, action) => {
                state.WorkSlotByDepartment = action.payload
                state.loading = false
            })
            .addCase(GetWorkedSlotByIdDepartmentAsyncApi.rejected, (state, action) => {
                state.loading = false
            })
        builder
            .addCase(GetWorkedSlotExcelAsyncApi.pending, (state) => {
                state.loading = true
            })
            .addCase(GetWorkedSlotExcelAsyncApi.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(GetWorkedSlotExcelAsyncApi.rejected, (state, action) => {
                state.loading = false
            })
    },
})

export default authSlice.reducer
export const WorkSlotEmployeeedAction = authSlice.actions

export const getWorkSlotEmployeeedAsyncApi = createAsyncThunk('WorkSlotEmployeeedReducer/getAsyncApi', async (id) => {
    try {
        const response = await GetWorkedSlotByIdEmployeeApi(id)
        return response
    } catch (error) {
        const json = error.response.data
        const errors = json[''].errors
        throw errors[0].errorMessage
    }
})

export const GetWorkedSlotByIdDepartmentAsyncApi = createAsyncThunk(
    'WorkSlotEmployeeedReducer/GetWorkedSlotByIdDepartmentApi',
    async ({ id, startTime, endTime }) => {
        try {
            const response = await GetWorkedSlotByIdDepartmentApi(id, startTime, endTime)
            return response
        } catch (error) {
            const json = error.response.data
            const errors = json[''].errors
            throw errors[0].errorMessage
        }
    }
)
export const GetWorkedSlotExcelAsyncApi = createAsyncThunk(
    'WorkSlotEmployeeedReducer/GetWorkedSlotExcelApi',
    async (id) => {
        try {
            const response = await GetWorkedSlotExcelApi(id)
            return response
        } catch (error) {
            const json = error.response.data
            const errors = json[''].errors
            throw errors[0].errorMessage
        }
    }
)
