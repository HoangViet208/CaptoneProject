import React, { useEffect, useState } from 'react'
import { Avatar, IconButton, Tooltip, FormControl, InputLabel, Select, MenuItem, Stack, Button } from '@mui/material'

//date-picker-range
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import dayjs from 'dayjs'
import { formattedDate } from '../../../Hook/useFormatDate'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import PopupData from '../../../Components/Popup'

export default function AllRequest() {
    const [open, setOpen] = useState()
    const handleClickOpen = () => {
        setOpen(true)
    }
    const [selectedDateRange, setSelectedDateRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    })
    const clickOpenFalse = (event) => {
        setOpen(false)
        setSelectedDateRange({
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        })
    }
    const handleDateRangeChange = (ranges) => {
        setSelectedDateRange(ranges.selection)
    }
    const handleClickSave = () => {
        setOpen(false)
    }
    const viewModalContent = (
        <DateRangePicker ranges={[selectedDateRange]} onChange={handleDateRangeChange} minDate={new Date()} />
    )
    const viewModalAction = (
        <Button autoFocus onClick={handleClickSave}>
            Save changes
        </Button>
    )

    return (
        <div className="bg-white block gap-10 my-5 lg:my-0 lg:flex">
            <PopupData
                open={open}
                clickOpenFalse={clickOpenFalse}
                viewTitle="Pick Date"
                viewContent={viewModalContent}
                viewAction={viewModalAction}
            />
            <Stack direction="row" spacing={2}>
                <Button
                    onClick={handleClickOpen}
                    variant="outlined"
                    sx={{
                        color: 'black',
                        borderColor: '#f3f4f6',
                        borderRadius: '200px',
                        '&:hover': {
                            borderColor: 'primary.main',
                            color: '#2196f3',
                        },
                    }}
                    startIcon={<EventAvailableIcon />}
                >
                    {selectedDateRange.startDate.getTime() == selectedDateRange.endDate.getTime()
                        ? formattedDate(selectedDateRange.startDate)
                        : formattedDate(selectedDateRange.startDate) + ' - ' + formattedDate(selectedDateRange.endDate)}
                </Button>
            </Stack>
        </div>
    )
}
