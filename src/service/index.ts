import axios, { type AxiosInstance } from "axios";

const URL_DESIGN = "http://localhost:8080/api";
const URL_GENERATOR = "http://localhost:5000/api";

const axiosDesign: AxiosInstance = axios.create({
  baseURL: URL_DESIGN,
});

const axiosGenerator: AxiosInstance = axios.create({
  baseURL: URL_GENERATOR,
});

export { axiosDesign, axiosGenerator };
