import Menu from "../components/menu.jsx";
import Header from "../components/header.jsx";
import {useState, useEffect} from "react";
import Header2 from "../components/header2.jsx";
import OpenFromButton from "../components/openFromButton.jsx";
import DataBalons from "../components/dadaBalons.jsx";
import SearchArea from "../components/searchArea.jsx";
import Filt from "../components/filt.jsx";
import ModalRevenues from "../components/modalRevenues.jsx";
import SideMenu from "../components/sideMenu.jsx";
import Select from "../components/select.jsx";
import { MenuProvider } from "../context/menuContext.jsx";
import {useForm} from "react-hook-form";
import MainRequests from "../services/requests.js";
import Inputs from "../components/inputs.jsx";
import NumericInputs from "../components/numericInputs.jsx";

const requests = new MainRequests()

function RevenuesPage() {
    const [showForm, setShowForm] = useState(false),
    [showOptions, setShowOptions] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [revenues, setRevenues] = useState([]);
    const [editData, setEditData] = useState(null);
    const [search, setSearch] = useState("")
    const [showFilter, setShowFilter] = useState(false);
    const [type, setType] = useState(""),
        [start_date, setStart_date] = useState(""),
        [end_date, setEnd_date] = useState("")
    const [members, setMembers] = useState([]);
    const [branches, setBranches] = useState([]);
    const [filted, setFilted] = useState([]);

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

    const onShowForm = () => {
        setShowForm(!showForm);
    };

    const fetchData = async () => {
        try {
            const response_revenues = await requests.onGet("revenues", search);
            const response_members = await requests.onGet("members", search);
            const response_branches = await requests.onGet("branches", search);

            setRevenues(response_revenues ? response_revenues: []);
            setMembers(response_members ? response_members : []);
            setBranches(response_branches ? response_branches : []);
        } catch (error) {
            console.error("Erro ao buscar revenues:", error);
        }
    };
    useEffect(() => {
        fetchData().then();

    }, [search]);

    useEffect(() => {

        if (!type && !start_date && !end_date) return;

        async function onFilterRevenues() {
            try {
                const response = await requests.onFilter("revenues", {
                    type,
                    start_date,
                    end_date,
                });
                setRevenues(response); // garante que seja array
            } catch (error) {
                console.error("Erro ao filtrar revenues:", error);
            }
        }

        onFilterRevenues().then(); //
    }, [type, start_date, end_date]);

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


    return (
        <div className="justify-center h-screen w-full">
            <MenuProvider>
                <Header/>
                <SideMenu/>
            </MenuProvider>
            <Menu/>

            <div className="flex justify-center">
                <div
                    className="flex flex-col justify-center mt-8 p-4 bg-bg-secondary-color border border-bg-secondary-destack-color rounded-lg shadow-md gap-5 w-[80vw] md:w-[55vw]">
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
                    <SearchArea placeholder={"Search by description or member..."}
                                showFilter={() => setShowFilter(!showFilter)}
                                onChange={(e) => {
                                    setSearch(e.target.value)
                                }}
                                value={search}/>
                        {showFilter && <Filt type={type} start_date={start_date} end_date={end_date}
                                             onChangeType={(e) => setType(e.target.value)}
                                             onChangeStartDate={(e) => setStart_date(e.target.value)}
                                             onChangeEndDate={(e) => setEnd_date(e.target.value)}
                                             options={["Dizimo", "Oferta", "Doação"]}/>}

                        {showForm && (
                            <div className="bg-bg-secondary-color p-3 rounded-sm border border-bg-secondary-destack-color shadow-md">
                                <form
                                    action={() => {
                                        handleSubmit(async (data) => {
                                            try {
                                                await requests.onPost("revenues", data)
                                                fetchData().then()
                                                reset()
                                            } catch (error) {
                                                console.error(error)
                                            }
                                        })()

                                    }}
                                    className="flex flex-col  space-y-3"
                                >
                                    <section className="flex flex-col items-start relative space-y-1">
                                        <label htmlFor="member" className="text-xs">
                                            Member
                                        </label>
                                        <input
                                            className="w-full text-xs bg-bg-secondary-color border rounded-md border-bg-secondary-destack-color hover:cursor-auto focus:border-primary-titles-color  focus:outline-none placeholder:text-gray-500 transition-all px-2 py-2"
                                            placeholder="Member" type="text" id="member"
                                            {...register("member")} />
                                        {showOptions && filted.length !== 0 && <div
                                            className={"w-full items-start bg-bg-primary-color border border-t-0 border-bg-secondary-color rounded-md rounded-t-none absolute top-11"}>
                                            <ul className={"w-full "}>
                                                {filted.map((member) => (
                                                    <li key={member.id}
                                                        onClick={() => selectSuggestion(member.name)}
                                                        className={"flex items-start pl-2 py-1 text-primary-titles-color  hover:bg-bg-secondary-destack-color"}>
                                                        {member.name}
                                                    </li>
                                                ))}

                                            </ul>
                                        </div>}

                                    </section>

                                    <section className="flex flex-row gap-4 w-full">
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
                                    <section className="flex flex-row gap-4 w-full">
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

                                    <div className="w-full flex flex-row mt-4 gap-4 ">
                                        <button
                                            type="submit"
                                            className="bg-neutral-950 text-white text-xs px-4 py-2 rounded-lg hover:bg-neutral-600 transition-discrete"
                                        >
                                            Submit
                                        </button>
                                        <button onClick={() => setShowForm(false)}
                                                className="bg-white border text-xs border-gray-200 shadow-xs text-black px-4 py-2 rounded-lg hover:bg-slate-200 transition-discrete">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {revenues.map((data) => (
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
                        ))}
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
