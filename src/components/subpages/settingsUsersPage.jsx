import {RolesBallons, UserBallons} from '../settingsBallons.jsx'
import {useEffect, useState} from "react";
import MainRequests from "../../services/requests.js";
import {Loader2, Plus, ScanBarcode} from "lucide-react";
import Inputs from "../inputs.jsx";
import { useForm,useFieldArray, Controller } from "react-hook-form"
import Header2 from "../header2.jsx";
import {FormateDate} from "../../services/formateDateService.js";
import Select from "../select.jsx";
import {MenuProvider} from "../../context/menuContext.jsx";
import Header from "../header.jsx";
import SideMenu from "../sideMenu.jsx";
import Menu from "../menu.jsx";

const request = new MainRequests()

export default function UsersPage(){
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [branches, setBranches] = useState([]);
    const [showSingUpUserForm, setShowSingUpUserForm] = useState(false);
    const {register, handleSubmit} = useForm();

    const getInfos = async () => {
        const response_users = await request.onGet('users');
        const response_roles = await request.onGet('roles');
        const response_sectors = await request.onGet('sectors');
        const response_branches = await request.onGet('branches', "");

        console.log(response_users);

        setUsers(response_users);
        setRoles(response_roles.roles);
        setSectors(response_sectors);
        setBranches(response_branches);
    }
    useEffect(()=>{
        getInfos().then();
    },[])

    const onDeleteUser = async (id) => {
        const deleted_user = await request.onDelete('users', id);
        console.log(deleted_user);

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
                        <div className="flex flex-col bg-bg-secondary-color w-[80%] md:w-[55%] p-6 rounded-lg shadow-lg space-y-4">
                            <div className="">
                                <form action={() => handleSubmit(async (data) => {
                                    await request.onPost("users", data)
                                    getInfos().then()
                                })()}
                                      className="flex flex-col  space-y-3">
                                    <Header2
                                        title={"Users Sing-Up"}
                                        description={"Form to sing-up users"}
                                    />
                                    <section className="flex flex-row gap-4 w-full">
                                        <Inputs id="name" type="text" placeholder={'Ex: JOAO DA MACEDO'}
                                                register={{...register("name")}}>User name *</Inputs>
                                        <Inputs id="email" type="email" placeholder={"Ex: João da melancia"} register={{...register("email")}}>Email *</Inputs>
                                    </section>

                                    <section className="flex flex-row gap-4 w-full">
                                        <Inputs id="phone_number" type="text" placeholder={'(61) 91234-5678'}
                                                register={{...register("phone_number")}}>Cellphone *</Inputs>
                                        <div className="flex flex-col items-start w-full space-y-1">
                                            <Select id={"designation"} register={{...register("designation")}} title={"Designação"} options={[
                                                {index:"", title: "Selecione uma opção"},
                                                ...roles.map(role => ({
                                                    index: String(role.id),
                                                    title: String(role.name)
                                                }))
                                            ]} />
                                        </div>

                                    </section>

                                    <section className="flex flex-row gap-4 w-full">
                                        <Inputs id="password" type="text" placeholder={'Ex: XXXXXXXXX'}
                                                register={{...register("password")}}>Password *</Inputs>
                                        <Inputs id="confirm_password" type="text" placeholder={'Ex: XXXXXXXXX'} register={{...register("confirm_password")}}>Confirm password *</Inputs>
                                    </section>

                                    <section className="flex flex-row gap-4 w-full">
                                        <div className="flex flex-col items-start w-full space-y-1">
                                            <Select id={"sector"} register={{...register("sector")}} title={"Se tor"} options={[
                                                {index:"", title: "Selecione uma opção"},
                                                ...sectors.map(sector => ({
                                                    index: String(sector.id),
                                                    title: String(sector.name)
                                                }))
                                            ]} />
                                        </div>
                                        <div className="flex flex-col items-start w-full space-y-1">
                                            <Select id={"branch"} register={{...register("branch")}} title={"Filial"} options={[
                                                {index:"", title: "Selecione uma opção"},
                                                ...branches.map(branch => ({
                                                    index: String(branch.id),
                                                    title: String(branch.name)
                                                }))
                                            ]} />
                                        </div>
                                    </section>

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
            {users.length === 0 &&
                <div className="justify-center h-screen w-full">
                    <div className="w-full h-[20%] flex flex-col justify-center items-center space-x-3">
                        <Loader2 className="animate-spin w-40 h-40"/>
                        <h2>Carregando...</h2>
                    </div>
                </div>
            }
            <div className={'grid grid-cols-1 gap-2 w-[80vw] md:w-[55vw] lg:grid-cols-2 xl:grid-cols-3'}>
                {users.map((user) => (
                    <UserBallons
                        key={user.id || user.email} // Always include a unique key!
                        user_name={user.name}
                        email={user.email}
                        cellphone={user.phone_number}
                        designation={user.designation_name}
                        sing_up_date={FormateDate(user.sing_up_date)} // Fixed a potential typo here
                        last_access={FormateDate(user.last_access)}
                        deleteUser={() => onDeleteUser(user.id)}
                    />
                ))}
            </div>
        </main>
    );
}
