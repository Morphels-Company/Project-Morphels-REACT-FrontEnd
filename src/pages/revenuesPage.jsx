import Menu from "../components/menu.jsx";
import Header from "../components/header.jsx";
import {useState, useEffect} from "react";
import Header2 from "../components/header2.jsx";
import OpenFromButton from "../components/openFromButton.jsx";
import DataBalons from "../components/dadaBalons.jsx";

import ModalRevenues from "../components/modalRevenues.jsx";
import SideMenu from "../components/sideMenu.jsx";
import Select from "../components/select.jsx";
import { MenuProvider } from "../context/menuContext.jsx";
import {useForm} from "react-hook-form";
import MainRequests from "../services/requests.js";
import Inputs from "../components/inputs.jsx";
import { Loader2 } from "lucide-react";
import DateFilterDropdown from "../components/DateFilterDropdown.jsx";

const requests = new MainRequests()

function RevenuesPage() {
    const [showForm, setShowForm] = useState(false),
    [showOptions, setShowOptions] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [revenues, setRevenues] = useState([]);
    const [editData, setEditData] = useState(null);
    const [members, setMembers] = useState([]);
    const [branches, setBranches] = useState([]);
    const [filted, setFilted] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const {register, watch, setValue, handleSubmit, reset} = useForm({
        defaultValues:{
            member: "",
            type: "",
            value: "",
            payment: "",
            branch: ""
        }
    });


    const searchTerm = watch("member")
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
            const response_revenues = await requests.onGet(`revenues/${start_date}/${end_date}`);
            const response_members = await requests.onGet("members");
            const response_branches = await requests.onGet("branches");

            console.log(response_revenues)

            setRevenues(response_revenues.length !== undefined ? response_revenues : []);
            setMembers(response_members.length !== 0 ? response_members : []);
            setBranches(response_branches.length !== 0 ? response_branches : []);
        } catch (error) {
            console.error("Erro ao buscar revenues:", error);
        }finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        setIsLoading(true);
        fetchData(period.start_date, period.end_date).then();

    }, [period]);

    const handlePeriodChange = ({ start_date, end_date }) => {
        setPeriod({ start_date, end_date });
    };

    // Filtra os itens em tempo real sem destruir a lista original do estado `expenses`
    const filteredRevenues = searchBarTerm
        ? revenues.filter((revenue) =>
            revenue.member.toLowerCase().includes(searchBarTerm.toLowerCase()))
        : revenues;

    useEffect(() => {
        if (searchTerm && searchTerm.length > 0) {
            const result = members.filter((member) =>
                member.name.toLowerCase().includes(searchTerm.toLowerCase()));
            if (searchTerm === result[0]?.name) {
                return
            }
            setShowOptions(true)
            setFilted(result)
        }else {
            setFilted([])
            setShowOptions(false);
        }

    }, [searchTerm])

    const selectSuggestion = (value) => {
        setValue("member", value);
        setFilted([])
        setShowOptions(false);
    }

    // Tela de carregamento inicial real baseada no estado isLoading

    return (
        <div className="justify-center h-screen w-full">
            <MenuProvider>
                <Header/>
                <SideMenu/>
            </MenuProvider>
            <Menu/>

            <div className="flex justify-center">
                <div
                    className="flex flex-col justify-start mt-8 p-4 bg-bg-secondary-color border border-bg-secondary-destack-color rounded-lg shadow-md gap-5 w-[90vw] h-[80vh] md:w-[55vw]">
                    <section className="flex justify-between items-center">
                        <Header2
                            title={"Fomulário de receitas"}
                            description={"Formulário de cadastro de receitas"}
                        />
                        <div className="flex justify-center">
                            <OpenFromButton onClick={onShowForm}>
                                {"Nova receita"}
                            </OpenFromButton>
                        </div>
                    </section>

                    <div className="flex  ">
                        <Inputs id="search_bar" type="text" placeholder="Busque pelo nome do membro"
                                register={{...register("search_bar")}} />

                    </div>
                    <div className="flex justify-end">
                        <DateFilterDropdown
                            defaultPeriodKey="this_month"
                            onApply={handlePeriodChange}
                        />
                    </div>

                    {/* Container animado de expansão/colapso */}
                    <div className={`grid transition-all duration-300 ease-in-out ${
                        showForm ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}>
                        <div className="overflow-hidden">
                            <div className="bg-bg-secondary-color p-3 rounded-lg border border-bg-secondary-destack-color shadow-md">
                                <form
                                    action={() => {
                                        handleSubmit(async (data) => {
                                            try {
                                                await requests.onPost("revenues", data)
                                                fetchData(period.start_date, period.end_date).then();
                                                reset()
                                            } catch (error) {
                                                console.error(error)
                                            }
                                        })()
                                    }}
                                    className="flex flex-col space-y-3"
                                >
                                    <section className="flex flex-col items-start relative space-y-1">
                                        <label htmlFor="member" className="text-xs">
                                            Member
                                        </label>
                                        <input
                                            className="w-full text-xs bg-bg-secondary-color border rounded-md border-bg-secondary-destack-color hover:cursor-auto focus:outline-none placeholder:text-gray-500 transition-all px-2 py-2"
                                            placeholder="Member" type="text" id="member"
                                            {...register("member")}
                                        />

                                        {showOptions && filted.length !== 0 && (
                                            <div className="w-full items-start bg-bg-primary-color border border-t-0 border-bg-secondary-color rounded-md rounded-t-none absolute top-11 z-30 shadow-lg">
                                                <ul className="w-full">
                                                    {filted.map((member) => (
                                                        <li key={member.id}
                                                            onMouseDown={(e) => {
                                                                e.preventDefault();
                                                                selectSuggestion(member.name);
                                                            }}
                                                            className="flex items-start pl-2 py-1 text-primary-titles-color hover:bg-bg-secondary-destack-color cursor-pointer"
                                                        >
                                                            {member.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </section>

                                    <section className="flex flex-col gap-4 w-full md:flex-row">
                                        <Select id={"type"} register={{...register("type")}} title={"Tipo"} options={[
                                            {index:"", title: "Selecione uma opção"},
                                            {index:"doação", title: "Doação"},
                                            {index:"contribuicao_regular", title: "Contribuição Regular"},
                                            {index:"oferta_especial", title: "Oferta Especial"},
                                            {index:"subvencao", title: "Subvenção/Subsídio"},
                                            {index:"patrocinio", title: "Patrocínio"},
                                            {index:"venda_serviço", title: "Venda/Serviço"},
                                            {index:"mensalidade", title: "Mensalidade"},
                                            {index:"rendimento_financeiro", title: "Rendimento financeiro"},
                                            {index:"outros", title: "Outros"},
                                        ]} />
                                        <Inputs id="values" type="number" placeholder="R$ 00,00" children="Valor" step="0.01"
                                                register={{...register("value")}}></Inputs>
                                    </section>

                                    <section className="flex flex-col gap-4 w-full md:flex-row">
                                        <Select id={"payment"} register={{...register("payment")}} title={"Meio de pagamento"} options={[
                                            {index:"", title: "Selecione uma opção"},
                                            {index:"pix_deposito", title: "Pix/Depósito"},
                                            {index:"dinheiro", title: "Dinheiro"},
                                            {index:"cheque", title: "Cheque"}
                                        ]} />
                                        <Inputs id="date" type="date" children="Data"
                                                register={{...register("date")}}></Inputs>
                                    </section>

                                    <section className="flex flex-col items-start">
                                        <Select id={"branch"} register={{...register("branch")}} title={"Filial"} options={[
                                            {index:"", title: "Selecione uma opção"},
                                            ...branches.map(branch => ({
                                                index: String(branch.id),
                                                title: String(branch.name)
                                            }))
                                        ]} />
                                    </section>

                                    <div className="w-full flex flex-row mt-4 gap-4">
                                        <button
                                            type="submit"
                                            className="bg-neutral-950 text-white text-xs px-4 py-2 rounded-lg hover:bg-neutral-600 transition-colors"
                                        >
                                            Submit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="bg-white border text-xs border-gray-200 shadow-xs text-black px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className={"overflow-auto"}>
                        {isLoading ? (
                            // 1. Se estiver carregando, mostra o loader
                            <div className=" flex flex-col justify-center items-center space-x-3">
                                <Loader2 className="animate-spin w-20 h-20"/>
                                <h2>Carregando...</h2>
                            </div>
                        ) : filteredRevenues.length === 0 ? (
                            // 2. Se já terminou de carregar mas a lista está vazia
                            <p className="text-center text-xs text-gray-400 py-4">Nenhuma receita encontrada.</p>
                        ) : (
                        filteredRevenues.map((data) => (
                            <DataBalons
                                key={data.id}
                                type={data.type}
                                date={data.date}
                                title={data.member}
                                value={data.value}
                                payment={data.payment}
                                color_value={"green"}
                                showEditForm={() => {
                                    setShowEditForm(true);
                                    setEditData(data);
                                }}
                                onDelete={async () => {
                                    try {
                                        await requests.onDelete("revenues", data.id)
                                        fetchData().then()
                                    } catch (error) {
                                        console.log(error);
                                    }
                                }}
                            />
                        ))
                    )}
                    </div>


                        {showEditForm && (
                            <ModalRevenues
                                onGetRevenues={() => fetchData()}
                                onHideForm={() => setShowEditForm(!showEditForm)}
                                complete={editData}
                                branches={branches}
                            />
                        )}
                </div>
            </div>
        </div>
    );
}

export default RevenuesPage;
