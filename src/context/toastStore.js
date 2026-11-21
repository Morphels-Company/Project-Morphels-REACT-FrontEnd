let toasts = [];
let nextId = 1;
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());

export const toastStore = {
    subscribe(listener) {
        listeners.add(listener);
        return () => listeners.delete(listener);
    },
    getSnapshot: () => toasts,
};

export function dismissToast(id) {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
}

export function showToast({ title, message, type = "error", duration = 6000 }) {
    // evita empilhar o mesmo erro repetido (ex: 5 requests falhando juntas)
    if (toasts.some((t) => t.title === title && t.message === message)) return;

    const id = nextId++;
    toasts = [...toasts.slice(-4), { id, title, message, type }]; // máx. 5 na tela
    emit();

    if (duration) setTimeout(() => dismissToast(id), duration);
    return id;
}