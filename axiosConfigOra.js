import axios from "axios";
import { url } from "./src/constants/baseUrl";
import { useNavigate } from "react-router-dom";

const axiosInstance = axios.create({
  baseURL: url,
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

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("user");
      const navigate = useNavigate();
      navigate("/login");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
