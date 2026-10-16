import { Trash2, Loader2 } from "lucide-react";
import Header2 from "../header2.jsx";
import OpenFromButton from "../openFromButton.jsx";
import Inputs from "../inputs.jsx";
import {useEffect, useState} from "react";
import MainRequests from "../../services/requests.js";
import {useForm} from "react-hook-form";
import Select from "../select.jsx";

const requests = new MainRequests()

export function MemberPage(){
    const [members, setMembers] = useState([])
    const [showMemberForm, setShowMemberForm] = useState(false)
    const [searchMembers, setSearchMembers] = useState("")
    const [branches, setBranches] = useState([])
    const [isLoading, setIsLoading] = useState(true);

    const {register, handleSubmit, watch} = useForm({
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
        }finally {
            setIsLoading(false);
        }

    }
    useEffect(()=>{
        onGetMembers(searchMembers).then();
    },[])


    async function onDeleteMember(id){
        try{
            await requests.onDelete("members", id);

            onGetMembers(searchMembers).then()
        }catch(error){
            console.log(error);
        }
    }

    const searchBarTerm = watch("search_bar");

    const filteredMembers = searchBarTerm ? members.filter(member => member.name.toLowerCase().includes(searchBarTerm.toLowerCase())) : members;

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
                                onClick={() => setShowMemberForm(!showMemberForm)}>{showMemberForm ? "Cancelar" : "Novo Membro"}</OpenFromButton>
                        </div>
                    </section>

                    <div className={`grid transition-all duration-300 ease-in-out ${
                        showMemberForm ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}>
                        <div className="overflow-hidden">
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
                                            register={{...register("cellphone")}}>Telefone *</Inputs>
                                    <Inputs id="dateBorn" type="date" register={{...register("date_birth")}}>Date
                                        of Birth</Inputs>
                                </section>
                                <section className="flex flex-row gap-4 w-full">
                                    <Inputs id="pixKey" type="text" placeholder={'Write the Pix key.'}
                                            register={{...register("pixkey")}}>Chave PIX</Inputs>
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
                    </div>
                </div>
            </div>
            <div className="flex justify-center">
                <div
                    className="flex flex-col justify-start mt-7 p-4 bg-bg-secondary-color border border-bg-secondary-destack-color rounded-lg shadow-md gap-5 w-[80vw] h-[60vh] md:w-[55vw]">
                    <Header2 title={"Cadastro de Membros"} description={""}/>
                    <section className="flex items-center gap-2">
                        <Inputs id="search_bar" type="text" placeholder="Busque pelo nome do membro"
                                register={{...register("search_bar")}} />
                    </section>
                    <section className="w-full rounded-lg border border-bg-secondary-destack-color overflow-auto">
                        <table className="w-full min-w-200">
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
                            {filteredMembers.length === 0 ? (
                                <p></p>
                            ) : (
                                filteredMembers.map((member) => {
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
                                }))}
                            </tbody>
                        </table>
                        {isLoading &&
                            <div className="justify-center w-full">
                                <div className="flex flex-col justify-center items-center space-x-3">
                                    <Loader2 className="animate-spin w-20 h-20"/>
                                    <h2>Carregando...</h2>
                                </div>
                            </div>

                        }

                    </section>
                </div>


            </div>

        </main>
    )
}