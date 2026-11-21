import { useSyncExternalStore } from "react";
import { toastStore, dismissToast } from "../context/toastStore.js";

// classes escritas por extenso para o Tailwind enxergar no build
const estilos = {
    error: "border-red-500 text-red-700",
    warning: "border-yellow-500 text-yellow-700",
    success: "border-green-500 text-green-700",
    info: "border-blue-500 text-blue-700",
};

export default function ToastContainer() {
    const toasts = useSyncExternalStore(toastStore.subscribe, toastStore.getSnapshot);

    return (
        <div className="fixed bottom-4 right-4 z-50 flex w-[calc(100%-2rem)] flex-col gap-2 sm:w-80">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    role="alert"
                    className={`flex items-start gap-3 rounded-lg border-l-4 bg-white p-4 shadow-lg ${estilos[t.type]}`}
                >
                    <div className="flex-1">
                        <p className="text-sm font-semibold">{t.title}</p>
                        <p className="mt-0.5 text-sm text-gray-500">{t.message}</p>
                    </div>
                    <button
                        onClick={() => dismissToast(t.id)}
                        className="text-gray-400 hover:text-gray-700"
                        aria-label="Fechar"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
}