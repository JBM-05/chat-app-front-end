import axios from "axios";
export const axiosInstance = axios.create({
  baseURL: import.meta.env.base_Url,
  withCredentials: true,
});
