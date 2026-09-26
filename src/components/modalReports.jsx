import { useForm } from "react-hook-form";
import SearchBar from "./searchBar.jsx";
import Header2 from "./header2.jsx";
import Inputs from "./inputs.jsx";
import MainRequests from "../services/requests.js";
import Select from "./select.jsx";

const request = new MainRequests()

function ModalReports({ onHideForm, onFetch, branches }) {
    const { register, handleSubmit } = useForm({
        defaultValues:{
            data: new Date(),
            options: {
                resume: false,
                revenues: false,
                expenses: false
            }
        }
        }
    );

    async function onPostReportPreset(data) {
        console.log(data);
        await request.onPost("reports", data)
        onFetch()
        onHideForm()

    }


    return (
        <div className="fixed inset-0 bg-[rgb(0,0,0,0.7)] bg-opacity-50 flex items-center justify-center">
            <div className="flex flex-col bg-bg-secondary-color h-[85%] w-[80%] md:w-[55%] p-6 rounded-lg shadow-lg space-y-4 overflow-auto">
                <Header2
                    title={"Create new report"}
                    description={"Form to create reports"}
                />
                <form
                    action={() => handleSubmit(onPostReportPreset)()}
                    className="flex flex-col  space-y-3"
                >
                    <div className="flex flex-col items-start rounded-lg border border-bg-secondary-destack-color p-3 gap-3">
                        <h1 className={"text-xl bold mb-2"}>Basic Information's</h1>
                        <section className="flex flex-col w-full items-start gap-1">
                            <label htmlFor="member" className="text-xs ">
                                Report´s title
                            </label>
                            <SearchBar
                                placeholder="Ex: Relatório Mensal - Janeiro 2025"
                                type="text"
                                id="member"
                                {...register("title")}
                            />
                        </section>
                        <section className="flex flex-col w-full items-start gap-1">
                            <Select id={"type"} register={{...register("type")}} title={"Tipo"} options={[
                                {index: "", title: "Selecione uma opção"},
                                {index: "mensal", title: "Mensal"},
                                {index: "trimestral", title: "Trimestral"},
                                {index: "semestral", title: "Semestral"},
                                {index: "anual", title: "Anual"},
                                {index: "customizado", title: "Customizado"}
                            ]}/>
                        </section>
                    </div>

                    <div className="flex flex-col items-start rounded-lg border border-bg-secondary-destack-color p-3 gap-3">
                        <h1 className={"text-xl bold mb-2"}>Period</h1>
                        <Inputs id="start_date" type="date" children="Data inicial"
                                register={{...register("start_date")}}></Inputs>
                        <Inputs id="end_date" type="date" children="Data final"
                                register={{...register("end_date")}}></Inputs>

                        <Select id={"branch"} register={{...register("branch")}} title={"Filial"} options={[
                            {index:"", title: "Selecione uma opção"},
                            ...branches.map(branch => ({
                                index: String(branch.id),
                                // Fique de olho: no Postgres você chamou de 'nome', verifique se o JSON da API traz 'nome' ou 'name'
                                title: String(branch.name)
                            }))
                        ]} />
                    </div>
                    <div className="flex flex-col items-start rounded-lg border border-bg-secondary-destack-color p-3 gap-3">
                        <h1 className={"text-xl bold mb-2"}>Sections to include</h1>
                        <section className={"flex items-center w-full  gap-1"}>
                            <input type="checkbox" {...register("options.resume")}/>
                            <p className={"text-xs"}>Resumo financeiro (totais de receitas, despesas e saldo)</p>
                        </section>
                        <section className={"flex items-center w-full  gap-1"}>
                            <input type="checkbox" {...register("options.revenues")}/>
                            <p className={"text-xs"}>Detalhamento de receitas (lista completa de receitas do periodo)</p>
                        </section>
                        <section className={"flex items-center w-full  gap-1"}>
                            <input type="checkbox" {...register("options.expenses")}/>
                            <p className={"text-xs"}>Detalhamento de despesas (lista completa de despesas do periodo)</p>
                        </section>

                    </div>
                    <div className="w-full flex flex-row mt-4 gap-4 ">
                        <button
                            type="submit"
                            className="bg-neutral-950 text-white text-xs px-4 py-2 rounded-lg hover:bg-neutral-600 transition-discrete"
                        >
                            Submit
                        </button>
                        <button
                            onClick={onHideForm}
                            className="bg-white border text-xs border-gray-200 shadow-xs text-black px-4 py-2 rounded-lg hover:bg-slate-200 transition-discrete"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModalReports;