import axios, { type AxiosInstance } from "axios";
import { Auth } from "aws-amplify";

const axiosDesign: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_DESIGN_API_URL,
});

const axiosGenerator: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_GENERATOR_API_URL,
});

const addAuthorizationHeader = async (req: any) => {
  const session = await Auth.currentSession(); // This will refresh the tokens if expired
  req.headers.Authorization = `Bearer ${session
    .getAccessToken()
    .getJwtToken()}`;
  return req;
};

axiosDesign.interceptors.request.use(addAuthorizationHeader);
axiosGenerator.interceptors.request.use(addAuthorizationHeader);

export { axiosDesign, axiosGenerator };
