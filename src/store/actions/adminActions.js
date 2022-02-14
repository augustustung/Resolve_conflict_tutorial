import actionTypes from './actionTypes';
import {
    getAllCodeService,
    createUserService,
    getAllUser,
    deleteUser,
    editUser,
    getTopDoctorHomeService,
    getAllDoctors,
    saveDoctorInfoService,
    getAllSpecialties,
    getAllClinics,
    getAllDoctorDetail
} from '../../services/userService'
import { toast } from 'react-toastify'

export const fetchGenderStart = () => {
    return async (dispatch) => {
        try {
            dispatch({
                type: actionTypes.FETCH_INFO_START
            })

            let res = await getAllCodeService('GENDER')
            if (res && res.errCode === 0) {
                dispatch(fetchGenderSuccess(res.data))
            } else {
                dispatch(fetchGenderFailed())
            }
        } catch (e) {
            dispatch(fetchGenderFailed())
            console.log("Fetch data failed", e)
        }
    }
}

export const fetchPostionStart = () => {
    return async (dispatch) => {
        try {

            let res = await getAllCodeService('POSITION')
            if (res && res.errCode === 0) {
                dispatch(fetchPositionSuccess(res.data))
            } else {
                dispatch(fetchPositionFailed())
            }
        } catch (e) {
            dispatch(fetchPositionFailed())
            console.log("Fetch data failed", e)
        }
    }
}

export const fetchRoleStart = () => {
    return async (dispatch) => {
        try {

            let res = await getAllCodeService('ROLE')
            if (res && res.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data))
            } else {
                dispatch(fetchRoleFailed())
            }
        } catch (e) {
            dispatch(fetchRoleFailed())
            console.log("Fetch data failed", e)
        }
    }
}

export const fetchGenderSuccess = (data) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: data
})

export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAIL
})

export const fetchPositionSuccess = (data) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: data
})

export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAIL
})

export const fetchRoleSuccess = (data) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: data
})

export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAIL
})

export const createUser = (data) => {
    return async (dispatch) => {
        try {

            let res = await createUserService(data)
            if (res && res.errCode === 0) {
                toast.success("Create a user successed!")
                dispatch(saveUserSuccess(res.data))
                dispatch(fetchAllUsersStart())
            } else {
                toast.error("Something went rong :( !")
                dispatch(saveUserFail())
            }
        } catch (e) {
            toast.error("Something went rong :( !")
            dispatch(saveUserFail())
            console.log("Fetch data failed", e)
        }
    }
}

export const saveUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS
})

export const saveUserFail = () => ({
    type: actionTypes.CREATE_USER_FAIL
})

export const fetchAllUsersStart = () => {
    return async (dispatch) => {
        try {

            let res = await getAllUser('ALL')
            if (res && res.errCode === 0) {
                dispatch(fetchAllUsersnSuccess(res.users.reverse()))
            } else {
                dispatch(fetchAllUsersnFailed())
            }
        } catch (e) {
            dispatch(fetchAllUsersnFailed())
            console.log("Fetch data failed", e)
        }
    }
}

export const fetchAllUsersnSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_USER_SUCCESS,
    users: data
})

export const fetchAllUsersnFailed = () => ({
    type: actionTypes.FETCH_ALL_USER_FAIL
})

export const deleteAUser = (userId) => {
    return async (dispatch) => {
        try {

            let res = await deleteUser(userId)
            if (res && res.errCode === 0) {
                toast.warn("Delete user successed!")
                dispatch(deleteUserSuccess(res.data))
                dispatch(fetchAllUsersStart())
            } else {
                toast.error("Something went rong :( !")
                dispatch(deleteUserFail())
            }
        } catch (e) {
            toast.error("Something went rong :( !")
            dispatch(deleteUserFail())
            console.log("Fetch data failed", e)
        }
    }
}

export const deleteUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS
})

export const deleteUserFail = () => ({
    type: actionTypes.DELETE_USER_FAIL
})

export const editAUser = (data) => {
    return async (dispatch) => {
        try {

            let res = await editUser(data)
            if (res && res.errCode === 0) {
                toast.warn("Update user successed!")
                dispatch(editUserSuccess(res.data))
                dispatch(fetchAllUsersStart())
            } else {
                toast.error("Update user info failed :( !")
                dispatch(editUserFail())
            }
        } catch (e) {
            toast.error("Update user info failed :( !")
            dispatch(editUserFail())
            console.log("Fetch data failed", e)
        }
    }
}

export const editUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS
})

export const editUserFail = () => ({
    type: actionTypes.EDIT_USER_FAIL
})

export const fetchTopDoctor = (limit) => {
    return async (dispatch) => {
        try {
            let res = await getTopDoctorHomeService(limit)
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTOR_SUCCESS,
                    data: res.data
                })
            } else {
                toast.error("Something went rong :( !")
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTOR_FAIL
                })
            }
        } catch (e) {
            console.log("Fetch data failed", e)
            toast.error("Something went rong :( !")
            dispatch({
                type: actionTypes.FETCH_TOP_DOCTOR_FAIL
            })
        }
    }
}

export const fetchALLDoctor = () => {
    return async (dispatch) => {
        try {
            let res = await getAllDoctors()
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTOR_SUCCESS,
                    data: res.data
                })
            } else {
                toast.error("Fetch data failed :( !")
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTOR_FAIL
                })
            }
        } catch (e) {
            console.log("Fetch data failed", e)
            toast.error("Fetch data failed :( !")
            dispatch({
                type: actionTypes.FETCH_ALL_DOCTOR_FAIL
            })
        }
    }
}

export const saveInfoDoctorRedux = (data) => {
    return async (dispatch) => {
        try {
            let res = await saveDoctorInfoService(data)
            if (res && res.errCode === 0) {
                toast.success("Saved data!")
                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS
                })
            } else {
                toast.error("Save data failed :( !")
                dispatch({ type: actionTypes.SAVE_DETAIL_DOCTOR_FAIL })
            }
        } catch (e) {
            console.log("Fetch data failed", e)
            toast.error("Save data failed :( !")
            dispatch({ type: actionTypes.SAVE_DETAIL_DOCTOR_FAIL })
        }
    }
}

export const fetchAllcodeSchedule = () => {
    return async (dispatch) => {
        try {
            let res = await getAllCodeService("TIME")
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_SUCCESS,
                    data: res.data
                })
            } else {
                toast.error("Fetch data failed :( !")
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_FAIL
                })
            }
        } catch (e) {
            console.log("Fetch data failed", e)
            toast.error("Fetch data failed :( !")
            dispatch({
                type: actionTypes.FETCH_ALLCODE_SCHEDULE_FAIL
            })
        }
    }
}

export const getDoctorRequiredInfo = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: actionTypes.FETCH_INFO_START })

            let resPrice = await getAllCodeService('PRICE')
            let resPayment = await getAllCodeService('PAYMENT')
            let resProvince = await getAllCodeService('PROVINCE')
            let resSpecialty = await getAllSpecialties()
            let resClinic = await getAllClinics()
            if (
                resPrice && resPrice.errCode === 0 &&
                resPayment && resPayment.errCode === 0 &&
                resProvince && resProvince.errCode === 0 &&
                resSpecialty && resSpecialty.errCode === 0 &&
                resClinic && resClinic.errCode === 0
            ) {
                let data = {
                    resPrice: resPrice.data,
                    resProvince: resProvince.data,
                    resPayment: resPayment.data,
                    resSpecialty: resSpecialty.data,
                    resClinic: resClinic.data
                }
                dispatch({
                    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_SUCCESS,
                    data: data
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_FAIL
                })
            }
        } catch (e) {
            dispatch({
                type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_FAIL
            })
            console.log("Fetch required doctor info failed", e)
        }
    }
}

export const fetchAllSpecialty = () => {
    return async (dispatch) => {
        try {
            let res = await getAllSpecialties()
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_SPECIALTY_SUCCESS,
                    data: res.data
                })
            } else {
                toast.error("Fetch data failed :( !")
                dispatch({
                    type: actionTypes.FETCH_ALL_SPECIALTY_FAIL
                })
            }
        } catch (e) {
            console.log("Fetch data failed", e)
            toast.error("Fetch data failed :( !")
            dispatch({
                type: actionTypes.FETCH_ALL_SPECIALTY_FAIL
            })
        }
    }
}

export const fetchAllClinic = () => {
    return async (dispatch) => {
        try {
            let res = await getAllClinics()
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_CLINIC_SUCCESS,
                    data: res.data
                })
            } else {
                toast.error("Fetch data clinic failed :( !")
                dispatch({
                    type: actionTypes.FETCH_ALL_CLINIC_FAIL
                })
            }
        } catch (e) {
            console.log("Fetch data clinic failed", e)
            toast.error("Fetch data clinic failed :( !")
            dispatch({
                type: actionTypes.FETCH_ALL_CLINIC_FAIL
            })
        }
    }
}

export const fetchAllDetailDoctor = () => {
    return async (dispatch) => {
        try {
            let res = await getAllDoctorDetail()
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_DETAIL_DOCTOR_SUCCESS,
                    data: res.data
                })
            } else {
                toast.error("Fetch data failed :( !")
                dispatch({
                    type: actionTypes.FETCH_ALL_DETAIL_DOCTOR_FAIL
                })
            }
        } catch (e) {
            console.log("Fetch detail data failed", e)
            toast.error("Fetch detail data failed :( !")
            dispatch({
                type: actionTypes.FETCH_ALL_DETAIL_DOCTOR_FAIL
            })
        }
    }
}
