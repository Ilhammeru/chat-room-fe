import axios, { type AxiosInstance } from 'axios'

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

export default axiosInstance
