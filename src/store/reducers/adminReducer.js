import actionTypes from '../actions/actionTypes';

const initialState = {
    genders: [],
    roles: [],
    positions: [],
    isLoading: false,
    users: [],
    topDoctors: [],
    allDoctors: [],
    allDoctorsDetail: [],
    allSpecialty: [],
    allClinic: [],
    allScheduleTime: [],
    requiredDoctorInfo: [],
    allProvince: []
}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_INFO_START:
            return {
                ...state,
                isLoading: true
            }
        case actionTypes.FETCH_GENDER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                genders: action.data
            }
        case actionTypes.FETCH_POSITION_SUCCESS:
            return {
                ...state,
                isLoading: false,
                positions: action.data
            }
        case actionTypes.FETCH_ROLE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                roles: action.data
            }
        case actionTypes.FETCH_ALL_USER_SUCCESS:
            return {
                ...state,
                users: action.users,
                isLoading: false
            }
        case actionTypes.FETCH_TOP_DOCTOR_SUCCESS:
            return {
                ...state,
                isLoading: false,
                topDoctors: action.data
            }
        case actionTypes.FETCH_ALL_DOCTOR_SUCCESS:
            return {
                ...state,
                allDoctors: action.data
            }
        case actionTypes.FETCH_ALLCODE_SCHEDULE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                allScheduleTime: action.data
            }
        case actionTypes.FETCH_REQUIRED_DOCTOR_INFO_SUCCESS:
            return {
                ...state,
                isLoading: false,
                requiredDoctorInfo: action.data
            }
        case actionTypes.FETCH_ALL_SPECIALTY_SUCCESS:
            return {
                ...state,
                isLoading: false,
                allSpecialty: action.data
            }
        case actionTypes.FETCH_ALL_CLINIC_SUCCESS:
            return {
                ...state,
                isLoading: false,
                allClinic: action.data
            }
        case actionTypes.FETCH_ALL_DETAIL_DOCTOR_SUCCESS:
            return {
                ...state,
                isLoading: false,
                allDoctorsDetail: action.data
            }
        case actionTypes.FETCH_ALL_DETAIL_DOCTOR_FAIL:
        case actionTypes.FETCH_ALL_CLINIC_FAIL:
        case actionTypes.FETCH_ALL_SPECIALTY_FAIL:
        case actionTypes.FETCH_REQUIRED_DOCTOR_INFO_FAIL:
        case actionTypes.FETCH_ALLCODE_SCHEDULE_FAIL:
        case actionTypes.FETCH_ALL_DOCTOR_FAIL:
        case actionTypes.FETCH_TOP_DOCTOR_FAIL:
        case actionTypes.FETCH_ALL_USER_FAIL:
        case actionTypes.FETCH_GENDER_FAIL:
        case actionTypes.FETCH_POSITION_FAIL:
        case actionTypes.FETCH_ROLE_FAIL:
            return {
                ...state,
                isLoading: false
            }
        default:
            return {
                ...state,
                isLoading: false
            }
    }
}

export default adminReducer;