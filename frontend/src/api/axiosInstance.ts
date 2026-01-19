import axios from "axios";

const axiosInstance = axios.create({
  baseURL:import.meta.env.VITE_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

//request Interceptors
axiosInstance.interceptors.request.use(
  (config) => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) 
        config.headers.Authorization = `Bearer ${userToken}`;
    return config;
  },
  (error) => {
    console.log(error);
  }
);

export default axiosInstance;