import { redirect } from 'react-router-dom';
import api from "./api.js";

export async function ValidateAuthentication() {
    try {
        const response = await api.get("/health");

        // Se a API retornar um status diferente de 200, redireciona para o login
        if (response.status !== 200) {
            return redirect("/");
        }

        return null; // Se estiver tudo ok, o loader retorna null e deixa a página abrir
    } catch (error) {
        // Se der erro na requisição (ex: 401 Unauthorized), redireciona também
        return redirect("/");
    }
}