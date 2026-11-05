export default function ErrorFallback({ resetErrorBoundary }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 p-6 text-center">
            <h1 className="text-2xl font-semibold text-gray-800">Algo deu errado</h1>
            <p className="max-w-md text-sm text-gray-500">
                Ocorreu um erro inesperado ao exibir esta página. Você pode tentar novamente ou voltar ao início.
            </p>
            <div className="flex gap-2">
                <button
                    onClick={resetErrorBoundary}
                    className="rounded bg-neutral-950 px-4 py-2 text-sm text-white hover:bg-neutral-600"
                >
                    Tentar novamente
                </button>
                <a href="/" className="rounded border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Ir para o início
                </a>
            </div>
        </div>
    );
}