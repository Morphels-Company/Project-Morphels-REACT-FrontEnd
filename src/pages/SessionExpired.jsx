import { useNavigate } from 'react-router-dom'
export default function SessionExpired() {
    const navigate = useNavigate();
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4  p-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-2xl">
                🔒
            </div>
            <h1 className="text-2xl font-semibold text-primary-titles-color">Sua sessão expirou</h1>
            <p className="max-w-sm text-sm text-primary-titles-color">
                Por segurança, seu acesso foi encerrado. Entre novamente para continuar.
            </p>
            <button
                onClick={() => navigate("/")}
                className="rounded bg-neutral-950 px-4 py-2 text-sm text-white hover:bg-neutral-600"
            >
                Fazer login
            </button>
        </div>
    );
}