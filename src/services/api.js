import axios from "axios";
import { showToast } from "../context/toastStore.js";

const api = axios.create({
    baseURL: import.meta.env.VITE_DATABASE_URL_ROOT,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const url = error.config?.url ?? "";

        // sem resposta = API fora do ar / sem internet
        if (!error.response) {
            showToast({
                title: "Sem conexão",
                message: "Não foi possível falar com o servidor.",
            });
            return Promise.reject(error);
        }

        // token expirado -> tela dedicada (ignora o próprio login, que dá 401 com senha errada)
        if (status === 401 && !url.includes("/login")) {
            if (window.location.pathname !== "/sessao-expirada") {
                window.location.assign("/sessao-expirada");
            }
            return Promise.reject(error);
        }

        showToast({
            title: status >= 500 ? `Erro no servidor (${status})` : `Erro ${status}`,
            message: error.response.data?.message || "Algo deu errado.",
        });

        return Promise.reject(error);
    }
);

export default api;