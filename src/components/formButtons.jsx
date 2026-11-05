function FormButtons({cancelFunction}) {
    return (
        <div className="w-full flex flex-row mt-4 gap-4">
            <button type={"submit"} className="bg-neutral-950 text-white text-xs px-4 py-2 rounded-lg hover:bg-neutral-600 transition-discrete">Enviar</button>
            <button type="button" onClick={cancelFunction} className="bg-white border text-xs border-gray-200 shadow-xs text-black px-4 py-2 rounded-lg hover:bg-slate-200 transition-discrete">Cancelar</button>
        </div>
    )
}
export default FormButtons;