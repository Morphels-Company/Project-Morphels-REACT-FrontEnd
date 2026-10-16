import {
    Search,
    Trash2,
    ScanBarcode,
    Loader2
} from "lucide-react";
import Header2 from "../header2.jsx";
import OpenFromButton from "../openFromButton.jsx";
import SearchBar from "../searchBar.jsx";
import Inputs from "../inputs.jsx";
import {useEffect, useState} from "react";
import MainRequests from "../../services/requests.js";
import {useForm} from "react-hook-form";
import Scanner from "../scanner.jsx";
import Select from "../select.jsx";

const requests = new MainRequests()





export function CardsPage() {
    const [cards, setCards] = useState([])
    const [members, setMembers] = useState([]);
    const [showForm, setShowForm] = useState(false),
        [showOptions, setShowOptions] = useState(false);
    const [showCardsForm, setShowCardsForm] = useState(false)
    const [searchCards, setSearchCards] = useState([])
    const [showScanner, setShowScanner] = useState(false)
    const [filted, setFilted] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("")
    const {register, watch, setValue, handleSubmit} = useForm({
        defaultValues:{
            bar_code: "",
            member: "",

        }
    });

    const fetchData = async () => {
        try {
            const response_members = await requests.onGet("members", "");
            setMembers(response_members);
        } catch (error) {
            console.error("Erro ao buscar revenues:", error);
        }finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        setIsLoading(true);
        fetchData().then();

    }, [search]);
    const searchTerm = watch("member")

    useEffect(() => {
        if (searchTerm && searchTerm.length > 0) {
            const result = members.filter((member) =>
                member.name.toLowerCase().includes(searchTerm.toLowerCase()));
            setShowOptions(true)
            setFilted(result)
        } else {
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
        <main>
            <div className="flex justify-center">
                <div
                    className="flex flex-col justify-center mt-7 p-4 bg-bg-secondary-color border-bg-secondary-destack-color rounded-lg shadow-md gap-5 w-[80vw] md:w-[55vw]">
                    <section className="flex justify-between items-center">
                        <Header2
                            title={"Formulário de cartões"}
                            description={"Formulário para cadastrar cartões de fidelidade"}
                        />
                        <div className="flex justify-center">
                            <OpenFromButton
                                onClick={() => setShowCardsForm(!showCardsForm)}>{showCardsForm ? "Cancelar" : "Novo cartão"}</OpenFromButton>
                        </div>
                    </section>
                    <div className={`grid transition-all duration-300 ease-in-out ${
                        showCardsForm ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}>
                        <div className="overflow-hidden">
                            <form action={() => handleSubmit(async (data) => {
                                await requests.onPost("cards", data)
                                fetchData().then()
                            })()}
                                  className="flex flex-col  space-y-3">
                                <section >
                                    <button type={"button"} onClick={() => setShowScanner(true)}
                                            className="flex items-center gap-4 bg-buttons-color border text-xs border-buttons-hover shadow-xs text-secondary-titles-color px-4 py-2 rounded-lg hover:bg-buttons-hover transition-discrete">
                                        <ScanBarcode size={20}/>
                                        Scan Code
                                    </button>
                                </section>
                                <section className="flex flex-row gap-4 w-full">
                                    <div className="flex flex-col items-start w-full space-y-1">
                                        <Inputs id={"bar_code"} type="text" children={"Bar code"} register={{...register("bar_code")}} placeholder={"0000000000000000000000"} />
                                    </div>
                                    <section className="w-full flex flex-col items-start relative">
                                        <label htmlFor="member" className="text-xs">
                                            Member
                                        </label>
                                        <input
                                            className="w-full text-xs bg-bg-secondary-color border border-bg-secondary-destack-color rounded-md hover:cursor-auto focus:outline-none placeholder:text-gray-500 transition-all px-2 py-2"
                                            placeholder="Member" type="text" id="member"
                                            {...register("member")} />
                                        {showOptions && filted.length !== 0 && <div
                                            className={"w-full items-start bg-gray-100 border border-t-0 border-gray-400 rounded-md rounded-t-none absolute top-11"}>
                                            <ul className={"w-full "}>
                                                {filted.map((member) => (
                                                    <li key={member.id}
                                                        onClick={() => selectSuggestion(member.name)}
                                                        className={"flex items-start pl-2 py-1 hover:bg-gray-300"}>
                                                        {member.name}
                                                    </li>
                                                ))}

                                            </ul>
                                        </div>}

                                    </section>
                                </section>


                                <section className="flex flex-row gap-4 w-full">
                                    <Inputs id="issue_date" type="date" placeholder={'(61) 91234-5678'}
                                            register={{...register("issue_date")}}>Issue Date *</Inputs>
                                    <Inputs id="due_date" type="date" register={{...register("due_date")}}>Due Date
                                        *</Inputs>
                                </section>

                                <section className="flex flex-row gap-4 w-full">
                                    <Select id={"status"} register={{...register("status")}} title={"Status"} options={[
                                        {index: "", title: "Selecione uma opção"},
                                        {index: "active", title: "Ativo"},
                                        {index: "due", title: "Vencido"},
                                        {index: "active", title: "Cancelado"},
                                    ]} />
                                </section>


                                <div className="w-full flex flex-row mt-4 gap-4 ">
                                    <button type="submit"
                                            className="bg-neutral-950 text-white text-xs px-4 py-2 rounded-lg hover:bg-neutral-600 transition-discrete">Submit
                                    </button>
                                    <button onClick={() => setShowCardsForm(false)}
                                            className="bg-white border text-xs border-gray-200 shadow-xs text-black px-4 py-2 rounded-lg hover:bg-slate-200 transition-discrete">Cancel
                                    </button>
                                </div>
                            </form>
                            {showScanner && <Scanner hidden={() => setShowScanner(false)} code={setValue}/>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center">
                <div
                    className="flex flex-col justify-start mt-7 p-4 bg-bg-secondary-color border border-bg-secondary-destack-color rounded-lg shadow-md gap-5 w-[80vw] h-[60vh] md:w-[55vw]">
                    <Header2 title={"Registered Member"} description={""}/>
                    <section className="flex items-center gap-2">
                        <Search size={16} className="text-gray-500"/>
                        <SearchBar placeholder="Member" type="text" id="member" value={searchCards}
                                   onChange={(e) => setSearchCards(e.target.value)}/>
                    </section>
                    <section className="w-full rounded-lg border border-bg-secondary-destack-color overflow-auto">
                        <table className="w-full min-w-200">
                            <thead className="">
                            <tr className="h-10 text-xs text-left border-b border-b-bg-secondary-destack-color">
                                <th className="px-2">Member</th>
                                <th>Barc Code</th>
                                <th>Issue Date</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th className="text-right px-2">Controlers</th>
                            </tr>
                            </thead>
                            <tbody>
                            {cards.map((card) => {
                                const formatedData = new Date(card.issue_date).toLocaleDateString("pt-BR", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                });
                                const formatedData2 = new Date(card.due_date).toLocaleDateString("pt-BR", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                });

                                return (
                                    <tr className="h-11 text-xs text-gray-900 text-left border-b border-b-neutral-200 hover:bg-gray-100"
                                        key={card.id}>
                                        <td className="p-2">{card.member}</td>
                                        <td>{card.bar_code}</td>
                                        <td className="flex flex-col gap-1 py-1">
                                            <section className=" text-gray-500">{formatedData}</section>
                                        </td>
                                        <td className="flex flex-col gap-1 py-1">
                                            <section className=" text-gray-500">{formatedData2}</section>
                                        </td>
                                        <td>
                                            <div
                                                className="inline-block border border-neutral-200 px-1 rounded-md">{card.status}</div>
                                        </td>


                                        <td>
                                            <div className="pr-3 flex justify-end  items-center gap-2">

                                                <button
                                                    className="text-red-600 hover:bg-red-200 p-1 rounded-md">
                                                    <Trash2 size={18}/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}

                            </tbody>
                        </table>

                    </section>
                    {isLoading &&
                        <div className="justify-center w-full">
                            <div className="flex flex-col justify-center items-center space-x-3">
                                <Loader2 className="animate-spin w-20 h-20"/>
                                <h2>Carregando...</h2>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </main>
    )
}