import axiosLibrary from "axios";;  
import Constants from "expo-constants";

const API_BASE = Constants.expoConfig?.extra?.API_BASE || 'http://localhost:8000';
const axios = axiosLibrary.create({
    baseURL: `${API_BASE}/api`,
    headers: {
        Accept: 'application/json',
    }
})

export default axios;