import axios from "axios";
import { openPermissionModal } from "../context/withoutPermissionModalHandler.js";

const api = axios.create({
    baseURL: import.meta.env.VITE_DATABASE_URL_ROOT,
    withCredentials: true

});

// Interceptor de resposta
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log(typeof (error.response.status));
        if (error.response && error.response.status >= 300 && error.response.status <= 399 ) {
            openPermissionModal(error.response.data?.message || "Não autorizado", error.response.status, ".")
        }else if (error.response && error.response.status >= 400 && error.response.status <= 499) {
            openPermissionModal(error.response.data?.message || "Não autorizado", error.response.status, "/")
        }else if (error.response && error.response.status >= 500 && error.response.status <= 599) {
            openPermissionModal(error.response.data?.message || "Não autorizado", error.response.status, ".");
        }
        return Promise.reject(error);
    }
);

export default api;


