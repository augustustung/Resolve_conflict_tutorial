import actionTypes from './actionTypes';

export const addUserSuccess = () => ({
    type: actionTypes.ADD_USER_SUCCESS
})

export const userLoginSuccess = (userInfo) => ({
    type: actionTypes.USER_LOGIN_SUCCESS,
    userInfo: userInfo
})

export const userLoginFail = () => ({
    type: actionTypes.USER_LOGIN_FAIL
})

export const processLogout = () => {
    window.location.href = "/home"
    window.localStorage.clear()
    return ({
        type: actionTypes.PROCESS_LOGOUT
    })
}

export const updateUserInfo = (payload) => ({
    type: actionTypes.UPDATE_USER_INFO,
    payload: payload
})