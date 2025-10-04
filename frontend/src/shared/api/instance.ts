import axios, {AxiosInstance} from "axios";

export const instance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_LINK || 'http://api.localhost',
    headers: {'Content-Type': 'multipart/form-data'},
})