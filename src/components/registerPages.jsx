import {
    Building2,
    CreditCard,
    Info,
    MapPin,
    Phone,
    Search,
    Trash2,
    ScanBarcode,
    Plus,
    ArrowDownToLine
} from "lucide-react";
import Header2 from "./header2.jsx";
import OpenFromButton from "./openFromButton.jsx";
import SearchBar from "./searchBar.jsx";
import Inputs from "./inputs.jsx";
import ModalInfo from "./modalInfo.jsx";
import {useEffect, useState} from "react";
import MainRequests from "../services/requests.js";
import {useForm} from "react-hook-form";
import Scanner from "./scanner.jsx";
import Select from "./select.jsx";

const requests = new MainRequests()

export function Page1(){
    const [members, setMembers] = useState([])
    const [showMemberForm, setShowMemberForm] = useState(false)
    const [searchMembers, setSearchMembers] = useState("")
    const [branches, setBranches] = useState([])

    const {register, handleSubmit} = useForm({
        defaultValues: {
            name: "",
            cellphone: null,
            date_birth: null,
            pixkey: null,
            pixtype: null,
            branch: null,

        }
    });

    async function onGetMembers(search) {
        try{
            const response_members = await requests.onGet("members", search);
            const response_branches = await requests.onGet("branches", search);

            setMembers(response_members ? response_members : []);
            setBranches(response_branches ? response_branches : []);
        }catch(error){
            console.log(error);
        }

    }
    useEffect(()=>{
        onGetMembers(searchMembers).then();
    },[])

    console.log(members)

    async function onDeleteMember(id){
        try{
            const deleted_member = await requests.onDelete("members", id);

            onGetMembers(searchMembers).then()
            console.log(deleted_member)
        }catch(error){
            console.log(error);
        }
    }


    return(
        <main>
            <div className="flex justify-center">
                <div
                    className="flex flex-col justify-center mt-7 p-4 bg-bg-secondary-color border border-bg-secondary-destack-color rounded-lg shadow-md gap-5 w-[80vw] md:w-[55vw]">
                    <section className="flex justify-between items-center">
                        <Header2
                            title={"Formulário de membros"}
                            description={"Formulário para cadastrar membros"}
                        />
                        <div className="flex justify-center">
                            <OpenFromButton
                                onClick={() => setShowMemberForm(!showMemberForm)}>{showMemberForm ? "Cancel" : "New Member"}</OpenFromButton>
                        </div>
                    </section>
                    {showMemberForm && (
                        <div className="">
                            <form action={() => handleSubmit(async (data) => {
                                await requests.onPost("members", data)
                                onGetMembers(searchMembers).then()
                            })()}
                                  className="flex flex-col  space-y-3">
                                <section className="flex flex-col items-start space-y-1">
                                    <Inputs id="name" type="text" placeholder={'Ex: João...'}
                                            register={{...register("name")}}>Nome *</Inputs>
                                </section>

                                <section className="flex flex-row gap-4 w-full">
                                    <Inputs id="cellphone" type="text" placeholder={'(61) 91234-5678'}
                                            register={{...register("cellphone")}}>Cellphone *</Inputs>
                                    <Inputs id="dateBorn" type="date" register={{...register("date_birth")}}>Date
                                        of Birth</Inputs>
                                </section>
                                <section className="flex flex-row gap-4 w-full">
                                    <Inputs id="pixKey" type="text" placeholder={'Write the Pix key.'}
                                            register={{...register("pixkey")}}>Pix Key</Inputs>
                                    <Select id={"pixtype"} register={{...register("pixtype")}} title={"Tipo de chave"} options={[
                                        {index:"", title:'Tipo de chave'},
                                        {index:"cpf", title:'CPF'},
                                        {index:"cnpj", title:'CNPJ'},
                                        {index:"email", title:'E-mail'},
                                        {index:"cellphone", title:'CPF'},
                                        {index:"aleatory_key", title:'Chave aleatória'},
                                    ]} />

                                </section>
                                <section className="flex flex-row gap-4 w-full">
                                    <Select id={"branch"} register={{...register("branch")}} title={"Filial"} options={[
                                        {index:"", title: "Selecione uma opção"},
                                        ...branches.map(branch => ({
                                            index: branch.id,
                                            // Fique de olho: no Postgres você chamou de 'nome', verifique se o JSON da API traz 'nome' ou 'name'
                                            title: branch.name
                                        }))
                                    ]} />
                                </section>

                                <div className="w-full flex flex-row mt-4 gap-4 ">
                                    <button type="submit"
                                            className="bg-neutral-950 text-white text-xs px-4 py-2 rounded-lg hover:bg-neutral-600 transition-discrete">Submit
                                    </button>
                                    <button onClick={() => setShowMemberForm(false)}
                                            className="bg-white border text-xs border-gray-200 shadow-xs text-black px-4 py-2 rounded-lg hover:bg-slate-200 transition-discrete">Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex justify-center">
                <div
                    className="flex flex-col justify-center mt-7 p-4 bg-bg-secondary-color border border-bg-secondary-destack-color rounded-lg shadow-md gap-5 w-[80vw] md:w-[55vw]">
                    <Header2 title={"Registed Member"} description={""}/>
                    <section className="flex items-center gap-2">
                        <Search size={16} className="text-gray-500"/>
                        <SearchBar placeholder="Member" type="text" id="member" value={searchMembers} onChange={(e) => setSearchMembers(e.target.value)} />
                    </section>
                    <section className="w-full rounded-lg border border-bg-secondary-destack-color overflow-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="">
                            <tr className="h-10 text-xs text-left border-b border-b-bg-secondary-destack-color">
                                <th className="px-2">Nome</th>
                                <th>Telefone</th>
                                <th>Idade</th>
                                <th>Tipo</th>
                                <th>Chave Pix</th>
                                <th className="text-right px-2">Controles</th>
                            </tr>
                            </thead>
                            <tbody>
                            {members.map((member) => {
                                const dataObj = new Date(member.date_birth);

                                const formatedData = dataObj.toLocaleDateString("pt-BR", {
                                    timeZone: "UTC",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                });

                                return (
                                    <tr className="h-11 text-xs text-left border-b border-bg-secondary-destack-color hover:bg-bg-secondary-destack-color" key={member.id}>
                                        <td className="p-2">{member.name}</td>
                                        <td>{member.cellphone}</td>
                                        <td className="flex flex-col gap-1 py-1">
                                            <section
                                                className="bold">{parseInt(new Date().getFullYear()) - parseInt(formatedData.substring(6, 10))} anos
                                            </section>
                                            <section className=" text-gray-500">{formatedData}</section>
                                        </td>
                                        <td>
                                            <div
                                                className="inline-block border border-neutral-200 px-1 rounded-md">{member.pixtype}</div>
                                        </td>
                                        <td>{member.pixkey}</td>

                                        <td>
                                            <div className="pr-3 flex justify-end  items-center gap-2">

                                                <button onClick={() => onDeleteMember(member.id)} className="text-red-600 hover:bg-bg-secondary-destack-color p-1 rounded-md">
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
                </div>


            </div>

        </main>
    )
}

export function Page2(){
    const [companies, setCompanies] = useState([])
    const [showCompaniesForm, setShowCompaniesForm] = useState(false)
    const [selectedCompanyInfo, setSelectedCompanyInfo] = useState(null);
    const [showInfo, setShowInfo] = useState(false);

    const [search, setSearch] = useState("")

    const {register, handleSubmit} = useForm();

    async function onGetCompanies() {
        try {
            const response = await requests.onGet("companies", search);
            console.log(response);
            setCompanies(response);
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    }

    function onShowInfo(data) {
        setSelectedCompanyInfo(data);
        setShowInfo(true)
    }

    useEffect(() =>{
        onGetCompanies().then()
    },[])

    async function onDeleteCompany(id){
        try{
            const deleted_company = await requests.onDelete("companies", id)

            onGetCompanies().then()
            console.log(deleted_company)
        }catch(error){
            console.log(error)
        }
    }

    return(<main>
        <div className="flex justify-center">
            <div
                className="flex flex-col justify-center mt-7 p-4 bg-bg-secondary-color border border-bg-secondary-destack-color rounded-lg shadow-md gap-5 w-[80vw] md:w-[55vw]">
                <section className="flex justify-between items-center">
                    <Header2
                        title={"Fomulário de companias"}
                        description={"Formulário de cadastro de companias"}
                    />
                    <div className="flex justify-center">
                        <OpenFromButton
                            onClick={() => setShowCompaniesForm(!showCompaniesForm)}>{showCompaniesForm ? "Cancel" : "New Company"}</OpenFromButton>
                    </div>
                </section>
                {showCompaniesForm && (
                    <div className="mt-4">

                        <form action={() => handleSubmit(async (data) => {
                            await requests.onPost("companies", data)
                            onGetCompanies().then()
                        })()}
                              className="flex flex-col  space-y-3">
                            <article className="space-y-3">
                                <section className="flex gap-2 items-center mb-4">
                                    <Building2 size={21}/>
                                    <h2 className="text-sm font-bold">Empress's Data</h2>
                                </section>
                                <section className="flex flex-row gap-4 w-full items-end">
                                    <Inputs id="cnpj" type="text" placeholder={'00.000.000/0000-00'}
                                            register={{...register("cnpj")}}>CNPJ *</Inputs>
                                    <div className="flex flex-col items-start w-[30%] space-y-2">
                                        <button
                                            className="w-full justify-center gap-3 flex flex-row text-xs text-secondary-titles-color bg-buttons-color hover:bg-buttons-hover border rounded-md border-bg-secondary-destack-color px-2 py-2">
                                            <Search size={16}/>
                                            <div>Buscar CNPJ</div>
                                        </button>
                                    </div>
                                </section>

                                <section className="flex flex-row gap-4 w-full">
                                    <Inputs id="companyName" type="text" placeholder={'Empresa ABC LTDA'}
                                            register={{...register("company_name")}}>Company Name *</Inputs>
                                    <Inputs id="fantasyName" type="text" placeholder={'ABC Empresa'}
                                            register={{...register("fantasy_name")}}>Fantasy Name</Inputs>

                                </section>
                                <section className="flex flex-row gap-4 w-full">
                                    <Inputs id="inscricaoEstadual" type="text" placeholder={'000000-0'}
                                            register={{...register("estate_registration")}}>Inscrição
                                        Estadual</Inputs>
                                    <Inputs id="inscricaoMunicipal" type="text" placeholder={'000000-0'}
                                            register={{...register("municipal_registration")}}>Inscrição
                                        Municipal</Inputs>

                                </section>
                                <section className="flex flex-row gap-4 w-full">
                                    <Inputs id="pixKey" type="date" register={{...register("open_date")}}>Open
                                        Date</Inputs>

                                    <Select id={"situations"} register={{...register("situation")}} title={"Situação"} options={[
                                        {index:"", title:"Selecione uma opção"},
                                        {index:"active", title:"Ativo"},
                                        {index:"suspence", title:"Suspenso"},
                                        {index:"inapt", title:"Inapta"},
                                        {index:"lowlands", title:"Baixada"}
                                    ]}/>
                                </section>
                            </article>
                            <article className="space-y-3">
                                <section className="flex gap-2 items-center mb-4 mt-4">
                                    <MapPin size={21}/>
                                    <h2 className="text-sm font-bold">Empress's Data</h2>
                                </section>
                                <section className="flex flex-row gap-4 w-full items-end">
                                    <div className="flex flex-col items-start w-[20%] space-y-2">
                                        <Inputs id="cep" type="text"
                                                placeholder={'00000-000'}
                                                register={{...register("cep")}}>CEP * </Inputs>
                                    </div>
                                    <Inputs id="street" type="text"
                                            placeholder={'Street name, Avenue, etc'}
                                            register={{...register("street")}}>Street </Inputs>
                                </section>
                                <section className="flex flex-row gap-4 w-full items-end">
                                    <div className="flex flex-col items-start w-[20%] space-y-2">
                                        <Inputs id="number" type="text"
                                                placeholder={'123'}
                                                register={{...register("number")}}>Número </Inputs>
                                    </div>
                                    <Inputs id="complement" type="text" placeholder={'Sala, Andar, etc'}
                                            register={{...register("complement")}}>Complement </Inputs>
                                </section>
                                <section className="flex flex-row gap-4 w-full items-end">
                                    <Inputs id="neighborhood" type="text" placeholder={'Neighborhood name'}
                                            register={{...register("neighborhood")}}>Neighborhood </Inputs>
                                    <div className="flex flex-col items-start w-[50%] space-y-2">
                                        <Inputs id="city" type="text" placeholder={'Ex: São Paulo...'}
                                                register={{...register("city")}}>Cidade </Inputs>
                                    </div>
                                    <div className="flex flex-col items-start w-[50%] space-y-1">
                                        <Select id={"uf"} register={{...register("uf")}} title={"UF"} options={
                                            [
                                                { "index": "ac", "title": "AC" },
                                                { "index": "al", "title": "AL" },
                                                { "index": "ap", "title": "AP" },
                                                { "index": "am", "title": "AM" },
                                                { "index": "ba", "title": "BA" },
                                                { "index": "ce", "title": "CE" },
                                                { "index": "df", "title": "DF" },
                                                { "index": "es", "title": "ES" },
                                                { "index": "go", "title": "GO" },
                                                { "index": "ma", "title": "MA" },
                                                { "index": "mt", "title": "MT" },
                                                { "index": "ms", "title": "MS" },
                                                { "index": "mg", "title": "MG" },
                                                { "index": "pa", "title": "PA" },
                                                { "index": "pb", "title": "PB" },
                                                { "index": "pr", "title": "PR" },
                                                { "index": "pe", "title": "PE" },
                                                { "index": "pi", "title": "PI" },
                                                { "index": "rj", "title": "RJ" },
                                                { "index": "rn", "title": "RN" },
                                                { "index": "rs", "title": "RS" },
                                                { "index": "ro", "title": "RO" },
                                                { "index": "rr", "title": "RR" },
                                                { "index": "sc", "title": "SC" },
                                                { "index": "sp", "title": "SP" },
                                                { "index": "se", "title": "SE" },
                                                { "index": "to", "title": "TO" }
                                            ]
                                        } />

                                    </div>
                                </section>
                            </article>
                            <article className="space-y-3">
                                <section className="flex gap-2 items-center mb-4 mt-4">
                                    <Phone size={21}/>
                                    <h2 className="text-sm font-bold">Contact</h2>
                                </section>
                                <section className="flex flex-row gap-4 w-full items-end">
                                    <Inputs id="cellphone" type="text" placeholder={'(61) 91234-5678'}
                                            register={{...register("cellphone")}}>Cellphone </Inputs>
                                    <Inputs id="telephone" type="text" placeholder={'company@contact.com'}
                                            register={{...register("email")}}>E-mail </Inputs>
                                </section>

                            </article>
                            <article className="space-y-3">
                                <section className="flex gap-2 items-center mb-4 mt-4">
                                    <Building2 size={21}/>
                                    <h2 className="text-sm font-bold">Atividade Econômica</h2>
                                </section>
                                <section className="flex flex-row gap-4 w-full items-end">
                                    <div className="flex flex-col items-start w-[30%] space-y-2">
                                        <Inputs id="cnae" type="text"
                                                placeholder={'0000-0/00'}
                                                register={{...register("cnae")}}>CNAE *</Inputs>
                                    </div>
                                    <Inputs id="activityDescription" type="text"
                                            placeholder={'Ex: Serviços de manutenção e reparação'}
                                            register={{...register("activity_description")}}>Descrição de
                                        Atividade </Inputs>
                                </section>

                            </article>
                            <article className="space-y-3">
                                <section className="flex gap-2 items-center mb-4 mt-4">
                                    <CreditCard size={21}/>
                                    <h2 className="text-sm font-bold">Dados para Pagamento</h2>
                                </section>
                                <section className="flex flex-row gap-4 w-full items-end">
                                    <div className="flex flex-col items-start w-[30%] space-y-1">
                                        <Select id={"pixtype"} register={{...register("pixtype")}} title={"Tipo de chave"} options={[
                                            {index:"", title:'Tipo de chave'},
                                            {index:"cpf", title:'CPF'},
                                            {index:"cnpj", title:'CNPJ'},
                                            {index:"email", title:'E-mail'},
                                            {index:"cellphone", title:'CPF'},
                                            {index:"aleatory_key", title:'Chave aleatória'},
                                        ]} />
                                    </div>
                                    <Inputs id="pixKeyPayment" type="text"
                                            placeholder={'Write the Pix key.'}
                                            register={{...register("pixkey")}}>Pix Key</Inputs>
                                </section>

                            </article>

                            <div className="w-full flex flex-row mt-4 gap-4 ">
                                <button type="submit"
                                        className="bg-neutral-950 text-white text-xs px-4 py-2 rounded-lg hover:bg-neutral-600 transition-discrete">Submit
                                </button>
                                <button onClick={() => setShowCompaniesForm(false)}
                                        className="bg-white border text-xs border-gray-200 shadow-xs text-black px-4 py-2 rounded-lg hover:bg-slate-200 transition-discrete">Cancel
                                </button>
                            </div>
                        </form>
                    </div>)}

            </div>
        </div>
        <div className="flex justify-center">
            <div
                className="flex flex-col justify-center mt-7 p-4 bg-bg-secondary-color border border-bg-secondary-destack-color rounded-lg shadow-md gap-5 w-[80vw] md:w-[55vw]">
                <Header2 title={"Registed Member"} description={""}/>
                <section className="flex items-center gap-2">
                    <Search size={16} className="text-gray-500"/>
                    <SearchBar placeholder="Member" type="text" id="member" value={search} onChange={(e) => setSearch(e.target.value)} />
                </section>

                <section className="w-full rounded-lg border border-bg-secondary-destack-color overflow-auto">
                    <table className="w-full min-w-200">
                        <thead className="w-full">
                        <tr className="text-xs text-left border-b border-bg-secondary-destack-color h-10">
                            <th className="px-2 whitespace-nowrap w-[20%]">Company Name</th>
                            <th className="whitespace-nowrap">Fantasy Name</th>
                            <th className="whitespace-nowrap">CNPJ</th>
                            <th className="whitespace-nowrap">City/UF</th>
                            <th className="whitespace-nowrap">Cellphone</th>
                            <th className="whitespace-nowrap">Situation</th>
                            <th className="whitespace-nowrap">CNAE</th>
                            <th className="text-right px-2 whitespace-nowrap">Actions</th>
                        </tr>
                        </thead>
                        <tbody className=" w-full">
                        {companies.map((company) => (
                            <tr className="text-xs text-primary-titles-color text-left border-b border-b-neutral-200 h-11 " key={company.id} >
                            <td className="px-2 whitespace-nowrap">{company.company_name}</td>
                            <td className="whitespace-nowrap">{company.fantasy_name}</td>
                            <td className="whitespace-nowrap">{company.cnpj}</td>
                            <td className="whitespace-nowrap">{company.city}/{(company.uf || '').toUpperCase()}</td>
                            <td className="whitespace-nowrap">{company.cellphone}</td>
                            <td>
                                <div className="inline-block  border bg-black text-white border-neutral-200 px-1 py-0.5 rounded-md uppercase whitespace-nowrap">
                                    {company.situation}
                                </div>
                            </td>
                            <td className="whitespace-nowrap">{company.cnae}</td>

                            <td>
                                <div className="pr-3 flex justify-end gap-2 items-center">
                                    <button onClick={() => {
                                        onShowInfo({
                                            cnpj: company.cnpj,
                                            fantasy_name: company.fantasy_name,
                                            estate_registration: company.estate_registration,
                                            municipal_registration: company.municipal_registration,
                                            open_date: company.open_date,
                                            situation: company.situation,
                                            company_name: company.company_name,
                                            cnae: company.cnae,
                                            activity_description: company.activity_description,
                                            cep: company.cep,
                                            street: company.street,
                                            number: company.number,
                                            complement: company.complement,
                                            neighborhood: company.neighborhood,
                                            city: company.city,
                                            uf: company.uf,
                                            email: company.email,
                                            cellphone: company.cellphone,
                                            pixtype: company.pixtype,
                                            pixkey: company.pixkey,
                                        })
                                    }} className="hover:bg-bg-secondary-destack-color p-1 rounded-md">
                                        <Info size={18}/>
                                    </button>
                                    <button onClick={() => onDeleteCompany(company.id)} className=" text-red-600 hover:bg-bg-secondary-destack-color p-1 rounded-md">
                                        <Trash2 size={18}/>
                                    </button>
                                </div>
                            </td>
                        </tr>))}

                        </tbody>
                    </table>

                </section>
            </div>
            {showInfo && selectedCompanyInfo && (
                <ModalInfo selectedCompanyInfo={selectedCompanyInfo}
                           setShowInfo={() => setShowInfo(false)}/>
            )}
        </div>
    </main>)
}

export function Page3() {
    const [cards, setCards] = useState([])
    const [members, setMembers] = useState([]);
    const [showForm, setShowForm] = useState(false),
        [showOptions, setShowOptions] = useState(false);
    const [showCardsForm, setShowCardsForm] = useState(false)
    const [searchCards, setSearchCards] = useState([])
    const [showScanner, setShowScanner] = useState(false)
    const [filted, setFilted] = useState([])
    const [search, setSearch] = useState("")
    const {register, watch, setValue, handleSubmit} = useForm({
        defaultValues:{
            bar_code: "",
            member: "",

        }
    });

    const fetchData = async () => {
        try {
            const response_members = await requests.onGet("members", search);
            setMembers(response_members);

        } catch (error) {
            console.error("Erro ao buscar revenues:", error);
        }
    };
    useEffect(() => {
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
                                onClick={() => setShowCardsForm(!showCardsForm)}>{showCardsForm ? "Cancel" : "New Card"}</OpenFromButton>
                        </div>
                    </section>
                    {showCardsForm && (
                        <div className="">
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
                                            className="w-full text-xs bg-bg-secondary-color border border-bg-secondary-destack-color rounded-md hover:cursor-auto focus:border-gray-400 focus:outline-none placeholder:text-gray-500 transition-all px-2 py-2"
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

                    )}
                </div>
            </div>
            <div className="flex justify-center">
                <div
                    className="flex flex-col justify-center mt-7 p-4 bg-bg-secondary-color border border-bg-secondary-destack-color rounded-lg shadow-md gap-5 w-[80vw] md:w-[55vw]">
                    <Header2 title={"Registered Member"} description={""}/>
                    <section className="flex items-center gap-2">
                        <Search size={16} className="text-gray-500"/>
                        <SearchBar placeholder="Member" type="text" id="member" value={searchCards}
                                   onChange={(e) => setSearchCards(e.target.value)}/>
                    </section>
                    <section className="w-full rounded-lg border border-bg-secondary-destack-color overflow-auto">
                        <table className="w-full min-w-[800px]">
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
                </div>
            </div>
        </main>
    )
}