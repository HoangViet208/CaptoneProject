import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min'
import AddIcon from '@mui/icons-material/Add'
//Firebase
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import { storage } from '../../../Config/FirebaseConfig'

//mui
import {
    Avatar,
    Button,
    FormControl,
    TextField,
    DialogActions,
    Tooltip,
    IconButton,
    Select,
    InputLabel,
    MenuItem,
    Radio,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Grid,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
//redux
import { PutEmployeeAsyncApi, getEmployeeByIdAsyncApi } from '../../../Redux/Employee/employeeSlice'
import { useSnackbar } from '../../../Hook/useSnackbar'
import { getDepartmentAsyncApi } from '../../../Redux/Department/DepartmentSlice'
import { getRoleAsyncApi } from '../../../Redux/Account/AccountSlice'
import NavbarManager from '../Navbar'
import IconBreadcrumbs from '../../../Components/Breadcrumbs'
import General from './General'
import AllRequest from './AllRequest'
import TabsData from '../../../Components/Tabs'
import PopupData from '../../../Components/Popup'

const breadcrumbIcons = () => {
    const data = [
        { title: 'Dashboard', url: '/', status: true },
        { title: 'Employee', url: '/Employee', status: true },
        { title: 'Employee Detail', url: '/Employee', status: false },
    ]
    return data
}

const dataBreadcrumbs = breadcrumbIcons()

const tabsData = [
    {
        label: 'General',
        //icon: <AccountBoxIcon />,
        view: <General />,
    },
    {
        label: 'All Request',
      //icon: <KeyIcon />,
        view: <AllRequest />,
    },
    // {
    //     label: 'Time Entries',
    //     icon: <EventNoteIcon />,
    //     view: <TimeEntries />,
    // },
]

export default function EmployeeDetail() {
    const [openModal, setOpenModal] = useState(false)
    const clickOpenFalse = (event) => {
        setOpenModal(false)
    }
    const handleClickOpenAdd = () => {
        setOpenModal(true)
    }
    const [click, SetClick] = useState(false)
    const [loadingButton, setLoadingButton] = useState(false)
    const showSnackbar = useSnackbar()
    const { EmployeeDetail } = useSelector((state) => state.employee)
    const { RoleList } = useSelector((state) => state.account)
    const { DepartmentList } = useSelector((state) => state.department)
    const param = useParams()

    const dispatch = useDispatch()
    useEffect(() => {
        // const userStringEmployeeName = localStorage.getItem('employeeId')
        // const employeeId = JSON.parse(userStringEmployeeName)
        console.log('effect', param.id)
        dispatch(getDepartmentAsyncApi())
        dispatch(getRoleAsyncApi())
        dispatch(getEmployeeByIdAsyncApi(param.id))
            .then((response) => {
                if (response.meta.requestStatus == 'fulfilled') {
                    console.log('effect', response)
                    formik.setValues({
                        username: response.payload.email,
                        firstName: response.payload.firstName,
                        lastName: response.payload.lastName,
                        gender: response.payload.gender,
                        address: response.payload.address,
                        phoneNumber: response.payload.phoneNumber,
                        roleID: response.payload.roleId,
                        departmentID: response.payload.departmentId,
                    })
                }
            })
            .catch((error) => {
                // Handle failure case
            })
        return () => {}
    }, [])
    const initialValues = {
        username: '',
        firstName: '',
        lastName: '',
        gender: '',
        address: '',
        phoneNumber: '',
        roleID: '',
        departmentID: '',
    }
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: Yup.object({
            username: Yup.string().required('Username is required').email('Invalid email address'),
            firstName: Yup.string().min(2, 'Too Short!').max(4000, 'Too Long!').required(),
            lastName: Yup.string().min(2, 'Too Short!').max(4000, 'Too Long!').required(),
            gender: Yup.string().required(),
            phoneNumber: Yup.string().required(),
            address: Yup.string().required(),
            roleID: Yup.string().required(),
            departmentID: Yup.string().required(),
        }),
        onSubmit: (values) => {
            setLoadingButton(true)
            const userStringEmployeeName = localStorage.getItem('employeeId')
            const employeeId = JSON.parse(userStringEmployeeName)
            const newData = {
                id: employeeId,
                username: values.username,
                firstName: values.firstName,
                lastName: values.lastName,
                gender: values.gender,
                address: values.address,
                phoneNumber: values.phoneNumber,
                roleID: values.roleId,
                departmentID: values.departmentId,
            }
            dispatch(PutEmployeeAsyncApi(newData))
                .then((response) => {
                    setLoadingButton(false)
                    if (response.meta.requestStatus == 'fulfilled') {
                        showSnackbar({
                            severity: 'success',
                            children: 'Update Employee successfully',
                        })
                        SetClick(false)
                        dispatch(getEmployeeByIdAsyncApi(employeeId))
                            .then((response) => {
                                if (response.meta.requestStatus == 'fulfilled') {
                                    formik.setValues({
                                        username: response.payload.email,
                                        firstName: response.payload.firstName,
                                        lastName: response.payload.lastName,
                                        gender: response.payload.gender,
                                        address: response.payload.address,
                                        phoneNumber: response.payload.phoneNumber,
                                        roleID: response.payload.roleId,
                                        departmentID: response.payload.departmentId,
                                    })
                                }
                            })
                            .catch((error) => {
                                // Handle failure case
                            })
                    }
                })
                .catch((error) => {
                    // Handle failure case
                    setLoadingButton(false)
                })
        },
    })
    let viewModalContent = <TabsData data={tabsData} />
    return (
        <div className="sm:ml-64 pt-12 h-screen bg-gray-50">
        
            <NavbarManager />
          
            <div className=" px-12 pt-2">
                <TabsData data={tabsData} />
            </div>
        </div>
    )
}
