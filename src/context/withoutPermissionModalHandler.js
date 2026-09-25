let openModalFn;

export function registerOpenModal(fn) {
    openModalFn = fn;
}

export function openPermissionModal(message, status_code, path) {
    if (openModalFn) {
        openModalFn(message, status_code, path);
    }
}