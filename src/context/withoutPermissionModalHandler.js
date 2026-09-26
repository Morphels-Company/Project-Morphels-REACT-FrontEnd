import { createContext } from "react";

// Exporta APENAS o objeto do contexto (não é um componente)
export const WithoutPermissionContext = createContext(undefined);

let openModalFn;

export function registerOpenModal(fn) {
    openModalFn = fn;
}

export function openPermissionModal(message, status_code, path) {
    if (openModalFn) {
        openModalFn(message, status_code, path);
    }
}