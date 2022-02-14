import axios from 'axios';
// import _ from 'lodash';

const instance = axios.create({
    baseURL: "https://daisycare-backend.herokuapp.com",
    // withCredentials: true
});

instance.interceptors.response.use(
    (response) => {
        // Thrown error for request with OK status code
        const { data } = response;
        return data;
    },
);

export default instance;
