import axios, { type AxiosInstance } from "axios";

const URL = "http://localhost:8080/api";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: URL,
});

export default axiosInstance;
