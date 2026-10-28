import Menu from "../components/menu.jsx";
import Header from "../components/header.jsx";
import { useState, useEffect } from "react";
import Header2 from "../components/header2.jsx";
import OpenFromButton from "../components/openFromButton.jsx";
import DataBalons from "../components/dadaBalons.jsx";
import { useForm } from "react-hook-form";
import ModalExpenses from "../components/modalExpences.jsx";
import MainRequests from "../services/requests.js";
import { MenuProvider } from "../context/menuContext.jsx";
import SideMenu from "../components/sideMenu.jsx";
import Select from "../components/select.jsx";
import Inputs from "../components/inputs.jsx";
import { Loader2 } from "lucide-react";
import DateFilterDropdown from "../components/DateFilterDropdown.jsx";

const requests = new MainRequests()

function ExpensesPage() {
    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editData, setEditData] = useState(null);
    const [expenses, setExpenses] = useState([]); // Lista completa da API
    const [branches, setBranches] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Estado de carregamento isolado

    const { register, handleSubmit, watch } = useForm({
        defaultValues: {
            title: null,
            type: null,
            value: null,
            payment: null,
            date: null,
            branch: null,
            beneficiary: null
        }
    });

    const searchBarTerm = watch("search_bar");

    const onShowForm = () => {
        setShowForm(!showForm);
    };
    const [period, setPeriod] = useState({
        start_date: new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), 1)).toISOString(),
        end_date:   new Date().toISOString(),
    });

    const fetchData = async (start_date, end_date) => {
        try {
            setIsLoading(true);
            const expensesResponse = await requests.onGet(`expenses/${start_date}/${end_date}`, "");
            const branchesResponse = await requests.onGet("branches", "");

            setExpenses(expensesResponse.length !== undefined ? expensesResponse : []);
            setBranches(branchesResponse);
        } catch (error) {
            console.error("Erro ao buscar despesas:", error);
        } finally {
            setIsLoading(false); // Finaliza o carregamento
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchData(period.start_date, period.end_date).then();

    }, [period]);

    const handlePeriodChange = ({ start_date, end_date }) => {
        setPeriod({ start_date, end_date });
    };


    const onSendData = async (data) => {
        await requests.onPost("expenses", data);
        fetchData(period.start_date, period.end_date).then();
    };

    // Filtra os itens em tempo real sem destruir a lista original do estado `expenses`
    const filteredExpenses = searchBarTerm
        ? expenses.filter((expense) =>
            expense.title.toLowerCase().includes(searchBarTerm.toLowerCase()))
        : expenses;

    return (
        <div className="justify-center h-[90vh] w-screen">
            <MenuProvider>
                <Header/>
                <SideMenu/>
            </MenuProvider>
            <Menu/>

            <div className="flex justify-center">
                <div className="flex flex-col justify-start mt-8 p-4 bg-bg-secondary-color border border-bg-secondary-destack-color rounded-lg shadow-md gap-5 w-[90vw] h-[90vh] md:w-[55vw] md:h-[80vh] overflow-hidden">
                    <section className="flex justify-between items-center shrink-0">
                        <Header2
                            title={"Fomulário de despesas"}
                            description={"Formulário para adicionar despesas"}
                        />
                        <div className="flex justify-center">
                            <OpenFromButton onClick={onShowForm}>{showForm ? "Fechar" : "Nova despesa"}</OpenFromButton>
                        </div>
                    </section>

                    <div className="flex shrink-0">
                        <Inputs id="search_bar" type="text" placeholder="Busque pelo nome do membro"
                                register={{...register("search_bar")}} />

                    </div>
                    <div className="flex justify-end shrink-0">
                        <DateFilterDropdown
                            defaultPeriodKey="this_month"
                            onApply={handlePeriodChange}
                        />
                    </div>

                    <div className={`grid shrink-0 transition-all duration-300 ease-in-out ${
                        showForm ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}>
                        <div className="overflow-hidden">
                            <div className="bg-bg-secondary-color p-3 rounded-lg border border-bg-secondary-destack-color shadow-md max-h-[45vh] overflow-y-auto">
                                <form action={handleSubmit(onSendData)} className="flex flex-col space-y-3">
                                    <section className="flex flex-col items-start">
                                        <Inputs id="title" type="text" children="Titulo" placeholder="Despesa ..."
                                                register={{...register("title")}} />
                                    </section>

                                    <section className="flex flex-col gap-4 w-full md:flex-row">
                                        <Select id={"type"} register={{...register("type")}} title={"Tipo"} options={[
                                            {index:"", title:"Selecione uma opção"},
                                            {index:"manutencao", title:"Manutencao"},
                                            {index:"salario", title:"Salários"},
                                            {index:"projetos", title:"Projetos"},
                                            {index:"utilidades", title:"Utilidades"},
                                            {index:"eventos", title:"Eventos"},
                                            {index:"outros", title:"Outros"}
                                        ]} />

                                        <Inputs id="value" type="number" children="Valor" placeholder="R$ 00,00" step="0.01"
                                                register={{...register("value")}} />
                                    </section>

                                    <section className="flex flex-col gap-4 w-full md:flex-row">
                                        <Select id={"payment"} register={{...register("payment")}} title={"Meio de pagamento"} options={[
                                            {index:"", title: "Selecione uma opção"},
                                            {index:"pix_deposito", title: "Pix/Depósito"},
                                            {index:"dinheiro", title: "Dinheiro"},
                                            {index:"cheque", title: "Cheque"}
                                        ]} />
                                        <Inputs id="date" type="date" children="Data"
                                                register={{...register("date")}} />
                                    </section>

                                    <section className="flex flex-col items-start gap-3">
                                        <Select id={"branch"} register={{...register("branch")}} title={"Filial"} options={[
                                            {index:"", title: "Selecione uma opção"},
                                            ...branches.map(branch => ({
                                                index: String(branch.id),
                                                title: String(branch.name)
                                            }))
                                        ]} />
                                        <Inputs id="beneficiary" type="text" children="Beneficiado" placeholder="Lojas ABC"
                                                register={{...register("beneficiary")}} />
                                    </section>

                                    <div className="w-full flex flex-row mt-4 gap-4">
                                        <button type={"submit"} className="bg-neutral-950 text-white text-xs px-4 py-2 rounded-lg hover:bg-neutral-600 transition-discrete">Submit</button>
                                        <button type="button" onClick={() => setShowForm(false)} className="bg-white border text-xs border-gray-200 shadow-xs text-black px-4 py-2 rounded-lg hover:bg-slate-200 transition-discrete">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Renderiza a lista filtrada */}
                    <div className={"flex-1 min-h-0 overflow-y-auto"}>
                        {isLoading ? (
                            // 1. Se estiver carregando, mostra o loader
                            <div className=" flex flex-col justify-center items-center space-x-3">
                                <Loader2 className="animate-spin w-20 h-20"/>
                                <h2>Carregando...</h2>
                            </div>
                        ) : filteredExpenses.length === 0 ? (
                            // 2. Se já terminou de carregar mas a lista está vazia
                            <p className="text-center text-xs text-gray-400 py-4">Nenhuma receita encontrada.</p>
                        ) : (
                            filteredExpenses.map((data) => (
                                <DataBalons
                                    key={data.id}
                                    type={data.type}
                                    date={data.date}
                                    title={data.title}
                                    value={data.value}
                                    payment={data.beneficiary}
                                    color_value={"green"}
                                    showEditForm={() => {
                                        setShowEditForm(true);
                                        setEditData(data);
                                    }}
                                    onDelete={async () => {
                                        await requests.onDelete("expenses", data.id);
                                        fetchData(period.start_date, period.end_date).then();
                                    }}
                                />
                            ))
                        )}
                    </div>


                    {showEditForm && <ModalExpenses
                        onGetExpenses={() => fetchData(period.start_date, period.end_date).then()}
                        onHideForm={() => setShowEditForm(!showEditForm)}
                        complete={editData}
                        branches={branches}
                    />}
                </div>
            </div>
        </div>
    );
}

export default ExpensesPage;