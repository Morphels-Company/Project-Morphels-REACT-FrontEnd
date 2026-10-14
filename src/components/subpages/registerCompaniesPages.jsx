import {
    Building2,
    CreditCard,
    Info,
    MapPin,
    Phone,
    Search,
    Trash2,
    Loader2
} from "lucide-react";
import Header2 from "../header2.jsx";
import OpenFromButton from "../openFromButton.jsx";
import SearchBar from "../searchBar.jsx";
import Inputs from "../inputs.jsx";
import ModalInfo from "../modalInfo.jsx";
import {useEffect, useState} from "react";
import MainRequests from "../../services/requests.js";
import {useForm} from "react-hook-form";
import Select from "../select.jsx";

const requests = new MainRequests()

export function CompaniesPage(){
    const [companies, setCompanies] = useState([])
    const [showCompaniesForm, setShowCompaniesForm] = useState(false)
    const [selectedCompanyInfo, setSelectedCompanyInfo] = useState(null);
    const [showInfo, setShowInfo] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [search, setSearch] = useState("")

    const {register, handleSubmit} = useForm();

    async function onGetCompanies() {
        try {
            const response = await requests.onGet("companies", search);
            setCompanies(response);
        } catch (error) {
            console.error('Error fetching companies:', error);
        }finally {
            setIsLoading(false);
        }
    }

    function onShowInfo(data) {
        setSelectedCompanyInfo(data);
        setShowInfo(true)
    }

    useEffect(() =>{
        setIsLoading(true);
        onGetCompanies().then()
    },[])

    async function onDeleteCompany(id){
        try{
            await requests.onDelete("companies", id)

            onGetCompanies().then()
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
                            onClick={() => setShowCompaniesForm(!showCompaniesForm)}>{showCompaniesForm ? "Cancelar" : "Nova Empresa"}</OpenFromButton>
                    </div>
                </section>

                <div className={`grid transition-all duration-300 ease-in-out ${
                    showCompaniesForm ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}>
                    <div className="overflow-hidden">

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
                                            register={{...register("company_name")}}>Nome da Compania*</Inputs>
                                    <Inputs id="fantasyName" type="text" placeholder={'ABC Empresa'}
                                            register={{...register("fantasy_name")}}>Nome Fantasia</Inputs>

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
                                    <Inputs id="pixKey" type="date" register={{...register("open_date")}}>Data de Abertura</Inputs>

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
                                    <h2 className="text-sm font-bold">Dados da Empresa</h2>
                                </section>
                                <section className="flex flex-row gap-4 w-full items-end">
                                    <div className="flex flex-col items-start w-[20%] space-y-2">
                                        <Inputs id="cep" type="text"
                                                placeholder={'00000-000'}
                                                register={{...register("cep")}}>CEP * </Inputs>
                                    </div>
                                    <Inputs id="street" type="text"
                                            placeholder={'Street name, Avenue, etc'}
                                            register={{...register("street")}}>Rua </Inputs>
                                </section>
                                <section className="flex flex-row gap-4 w-full items-end">
                                    <div className="flex flex-col items-start w-[20%] space-y-2">
                                        <Inputs id="number" type="text"
                                                placeholder={'123'}
                                                register={{...register("number")}}>Número </Inputs>
                                    </div>
                                    <Inputs id="complement" type="text" placeholder={'Sala, Andar, etc'}
                                            register={{...register("complement")}}>Complemento </Inputs>
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
                                            register={{...register("cellphone")}}>Telefone </Inputs>
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
                                            placeholder={'Chave PIX'}
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
                    </div>
                </div>
            </div>
        </div>
        <div className="flex justify-center">
            <div
                className="flex flex-col justify-start mt-7 p-4 bg-bg-secondary-color border border-bg-secondary-destack-color rounded-lg shadow-md gap-5 w-[80vw] h-[60vh] md:w-[55vw]">
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
                {isLoading &&
                    <div className="justify-center w-full">
                        <div className="flex flex-col justify-center items-center space-x-3">
                            <Loader2 className="animate-spin w-20 h-20"/>
                            <h2>Carregando...</h2>
                        </div>
                    </div>
                }
            </div>
            {showInfo && selectedCompanyInfo && (
                <ModalInfo selectedCompanyInfo={selectedCompanyInfo}
                           setShowInfo={() => setShowInfo(false)}/>
            )}
        </div>
    </main>)
}