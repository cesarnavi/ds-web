import { JWT_STORAGE_KEY } from '@/constants';
import Axios from 'axios';
const AxiosApiInstance = Axios.create({
    baseURL: process.env.API_URI
});

// Request interceptor for API calls
AxiosApiInstance.interceptors.request.use(
    async config => {
        
        const ACCESS_TOKEN = window && window.localStorage.getItem(JWT_STORAGE_KEY);
        if (ACCESS_TOKEN && ACCESS_TOKEN != undefined) {
            config.headers.Authorization = `Bearer ${ACCESS_TOKEN}`;
        }
        return config;
    },
    error => {
        Promise.reject(error)
    });


export default AxiosApiInstance;