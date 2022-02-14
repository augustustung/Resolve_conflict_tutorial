import axios from '../axios'

export const handleLogin = (userEmail, userPassword) => {
    return axios.post('/api/login', {
        email: userEmail,
        password: userPassword
    })
}

export const getAllUser = (userId) => {
    return axios.get(`/api/get-all-users?id=${userId}`)
}

export const createUserService = (data) => {
    return axios.post("/api/create-new-user", data);
}

export const deleteUser = (userId) => {
    return axios.delete('/api/delete-user', {
        data: {
            id: userId
        }
    })
}

export const editUser = (userInfo) => {
    return axios.put('/api/edit-user', userInfo)
}

export const getAllCodeService = (inputType) => {
    return axios.get(`/api/allcode?type=${inputType}`)
}

export const getTopDoctorHomeService = (limit) => {
    return axios.get(`/api/top-doctor-home?limit=${limit}`)
}

export const getAllDoctors = () => {
    return axios.get("/api/get-all-doctors")
}

export const saveDoctorInfoService = (data) => {
    return axios.post(`/api/save-info-doctors`, data)
}

export const getDetailInfoDoctor = (id) => {
    return axios.get(`/api/get-detail-doctors-by-id?id=${id}`)
}

export const saveBulkSchedule = (data) => {
    return axios.post(`/api/bulk-create-schedule`, data)
}

export const getScheduleDoctorByDate = (doctorId, date) => {
    return axios.get(`/api/get-schedule-doctors-by-date?doctorId=${doctorId}&date=${date}`)
}

export const getExtraInfoDoctorById = (id) => {
    return axios.get(`/api/get-extra-info-doctors-by-id?doctorId=${id}`)
}

export const getProfileDoctorById = (id) => {
    return axios.get(`/api/get-profile-doctors-by-id?doctorId=${id}`)
}

export const postBookingAppointment = (data) => {
    return axios.post(`/api/patient-book-schedule`, data)
}

export const postVerifyBooking = (data) => {
    return axios.post(`/api/verifying-book-appointment`, data)
}

export const createNewSpecialty = (data) => {
    return axios.post(`/api/create-a-new-specialty`, data)
}

export const getTopSpecialties = (limit) => {
    return axios.get(`/api/get-top-specialties-home?limit=${limit}`)
}

export const getAllSpecialties = () => {
    return axios.get("/api/get-all-specialties")
}

export const getDetailSpecialtyById = (data) => {
    return axios.get(`/api/get-detail-specialty-by-id/?id=${data.id}&location=${data.location}`)
}

export const deleteSpecialty = (id) => {
    return axios.delete('/api/delete-specialty', {
        data: {
            id: id
        }
    })
}

export const editSpecialty = (data) => {
    return axios.put('/api/edit-specialty', data)
}

export const createNewClinic = (data) => {
    return axios.post(`/api/create-a-new-clinic`, data)
}

export const getTopClinics = (limit) => {
    return axios.get(`/api/get-top-clinics-home?limit=${limit}`)
}

export const getAllClinics = () => {
    return axios.get("/api/get-all-clinics")
}

export const getDetailClinicById = (id) => {
    return axios.get(`/api/get-detail-clinic-by-id/?id=${id}`)
}

export const deleteClinic = (id) => {
    return axios.delete('/api/delete-clinic', {
        data: {
            id: id
        }
    })
}

export const editClinic = (data) => {
    return axios.put('/api/edit-clinic', data)
}

export const getAllPatient = (id, date) => {
    return axios.get(`/api/get-list-patient-by-doctor/?id=${id}&date=${date}`)
}

export const sendEmailRemedyService = (data) => {
    return axios.post(`/api/send-remedy`, data)
}

export const getAllDoctorDetail = () => {
    return axios.get("/api/get-all-doctors-detail")
}