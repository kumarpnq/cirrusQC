import axios from "axios";
import { url_mongo } from "./src/constants/baseUrl";

const axiosInstance = axios.create({
  baseURL: url_mongo,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("user");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
