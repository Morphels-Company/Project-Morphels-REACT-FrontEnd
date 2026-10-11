import {RolesBallons} from '../settingsBallons.jsx'
import {useEffect, useState} from "react";
import MainRequests from "../../services/requests.js";
import {Loader2, Plus} from "lucide-react";
import Inputs from "../inputs.jsx";
import { useForm,useFieldArray } from "react-hook-form"
import Header2 from "../header2.jsx";
import Select from "../select.jsx";

const request = new MainRequests()

export default function PermissionsPage(){
    const [roles, setRoles] = useState([]);
    const [pages, setPages] = useState([]);
    const [numberOfPages, setNumberOfPages] = useState(0);
    const [showSingUpUserForm, setShowSingUpUserForm] = useState(false);
    const {register, control, handleSubmit, setValue} = useForm({
        defaultValues: {
            role_name: "",
            role_description: "",
            registers:[{
                page: "",
                can_view: false,
                can_add: false,
                can_edit: false,
                can_delete: false,
                access_scope: ""
            }]
        }
    });


    const getInfos = async () => {
        const roles_response = await request.onGet('roles');
        const pages_response = await request.onGet('pages');
        const response_number_of_pages = await request.onGet('pages/count');

        setRoles(roles_response.roles);
        setPages(pages_response);
        setNumberOfPages(parseInt(response_number_of_pages[0]?.number_of_pages));
    }

    useEffect(()=>{
        getInfos().then();
    },[])

    const onCreateNewRoleAndPermissions = async (data) => {
        const role_id = await request.onPost('roles', {name: data.role_name, description: data.role_description});
        console.log(role_id.data[0]?.id);
        console.log(data.registers.page);
        const payload = data.registers.map((item, index) => ({
            ...item,
            page_id: pages[index].id
        }));
        console.log(payload);
        const permission_response = await request.onPost('permissions', {
            role_id: role_id.data[0]?.id,
            registers: payload,
        })

        console.log(permission_response)
        getInfos().then();
    }

    const onDeleteRoleAndPermissions = async (id) => {
        const deleted_role = await request.onDelete('roles', id)
        const deleted_permission = await request.onDelete('permissions', id)
        console.log(deleted_permission, deleted_role);

        getInfos().then();
    }

    return (
        <main className={'flex flex-col items-center justify-center '}>
            <div className={'flex w-[55vw] justify-between items-center py-6'}>
                <section className={'flex flex-col items-start '}>
                    <h1 className={'text-2xl'}>Cadastro de Usuários</h1>
                    <h2 className={'text-sm text-neutral-500'}>Gerencie os usuários do sistema</h2>
                </section>
                <section>
                    <button onClick={() => setShowSingUpUserForm(true)} className={'flex gap-2 bg-black text-primary-titles-color text-sm p-2 rounded-md items-center'}><Plus size={16}/> <p>Novo Usuário</p> </button>
                </section>
                {showSingUpUserForm && (
                    <div className="fixed inset-0 bg-[rgb(0,0,0,0.7)] bg-opacity-50 flex items-center justify-center">
                        <div className="flex flex-col bg-bg-secondary-color h-[70%] w-[80%] md:w-[33%] p-6 rounded-lg shadow-lg space-y-4 overflow-auto">
                            <div className="">
                                <form action={() => handleSubmit(onCreateNewRoleAndPermissions)()}
                                      className="flex flex-col  space-y-3">
                                    <Header2
                                        title={"Users Sing-Up"}
                                        description={"Form to sing-up users"}
                                    />
                                    <section className="flex flex-col gap-4 w-full pb-4 border-b-2 border-bg-secondary-destack-color">
                                        <Inputs id="name" type="text" placeholder={'Ex: JOAO DA MACEDO'}
                                                register={{...register("role_name")}}>Designação *</Inputs>
                                        <Inputs id="description" type="text" placeholder={"Ex: Gerenciamento das receitas"} register={{...register("role_description")}}>Descrição *</Inputs>
                                    </section>

                                    <section className={"flex justify-between items-center"}>
                                        <h2 className={"font-bold text-sm"}>Permissões de acesso*</h2>
                                        <p className={"text-xs text-secondary-destack-color"}>Selecione as opções para cada módulo</p>
                                    </section>


                                    {pages.map((page, index) => {
                                        setValue(`registers.${index}.page`, page.id);
                                        return(

                                            <section className="flex flex-col gap-4 w-full rounded-md border border-gray-300 p-5">
                                                <nav className={"flex w-full space-x-8 items-center justify-between pb-2"}>
                                                    <div>
                                                        <h2 className={"text-md"}>{page.name.charAt(0).toUpperCase() + page.name.slice(1)}</h2>
                                                        <p>{page.description}</p>
                                                    </div>

                                                    <div className={"flex w-[50%]"}>
                                                        <Select id={"access_scope"} title={"Escopo de acesso"} register={{...register(`registers.${index}.access_scope`)}} options={[
                                                            {index: "", title: "Selecione uma opção"},
                                                            {index: "local", title: "Local - visualiza os dados da filial"},
                                                            {index: "sector", title: "Setorial - visualiza os dados do setor"},
                                                            {index: "global", title: "Global - visualiza os dados de toda a organização"}
                                                        ]}/>
                                                    </div>
                                                </nav>

                                                <div className={"flex gap-4 justify-around items-center"}>
                                                    <section className={"flex items-center w-full  gap-1"}>
                                                        <input type="checkbox" {...register(`registers.${index}.can_view`)}/>
                                                        <p className={"text-xs"}>Visualizar</p>
                                                    </section>
                                                    <section className={"flex items-center w-full  gap-1"}>
                                                        <input type="checkbox" {...register(`registers.${index}.can_add`)}/>
                                                        <p className={"text-xs"}>Criar</p>
                                                    </section>
                                                    <section className={"flex items-center w-full  gap-1"}>
                                                        <input type="checkbox" {...register(`registers.${index}.can_edit`)}/>
                                                        <p className={"text-xs"}>Editar</p>
                                                    </section>
                                                    <section className={"flex items-center w-full  gap-1"}>
                                                        <input type="checkbox" {...register(`registers.${index}.can_delete`)}/>
                                                        <p className={"text-xs"}>Deletar</p>
                                                    </section>
                                                </div>


                                            </section>
                                        )
                                    })}




                                    <div className="w-full flex flex-row mt-4 gap-4 ">
                                        <button type="submit"
                                                className="bg-neutral-950 text-white text-xs px-4 py-2 rounded-lg hover:bg-neutral-600 transition-discrete">Submit
                                        </button>
                                        <button onClick={() => setShowSingUpUserForm(false)}
                                                className="bg-white border text-xs border-gray-200 shadow-xs text-black px-4 py-2 rounded-lg hover:bg-slate-200 transition-discrete">Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {roles.length === 0 ??
                <div className="justify-center h-screen w-full">
                    <div className="w-full h-[20%] flex flex-col justify-center items-center space-x-3">
                        <Loader2 className="animate-spin w-40 h-40"/>
                        <h2>Carregando...</h2>
                    </div>
                </div>
            }
            <div className={'grid grid-cols-1 gap-2 w-[80vw] md:w-[55vw] xl:grid-cols-2 2xl:grid-cols-3'}>
                {roles.map((role) => (
                    <RolesBallons
                        key={role.id} // Always include a unique key!
                        role={role}
                        number_of_pages={numberOfPages}
                        deleteRoleAndPermissions={() => onDeleteRoleAndPermissions(role.id)}
                    />
                ))}
            </div>
        </main>
    );
}