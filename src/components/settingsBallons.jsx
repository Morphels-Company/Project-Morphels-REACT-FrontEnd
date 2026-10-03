import {Calendar, Mail, Phone, Shield, Trash2, Building2, MapPin, User, Layers, ChevronDown, ChevronUp } from "lucide-react";
import {useState, useEffect} from "react";
import MainRequests from "../services/requests.js";

const requests = new MainRequests()

export function UserBallons({user_name, email, cellphone, designation, sing_up_date, last_access, deleteUser}) {
    return (
        <article
            className={"grid grid-flow-col grid-rows-[auto_1fr] w-full gap-3 bg-bg-secondary-color border border-bg-secondary-destack-color rounded-xl p-5"}>
            <div className={"w-full flex items-center justify-start gap-3 m-0 p-0"}>
                <section>
                    <h1 className={'h-fit bg-black text-secondary-titles-color rounded-2xl px-2 py-1'}>JS</h1>
                </section>
                <section className={'space-y-1'}>
                    <h2>{user_name}</h2>
                </section>
            </div>
            <div className={"w-full flex flex-col items-start justify-start gap-2"}>
                <ul className={'items-center justify-start space-y-2'}>
                    <li className={'flex items-center gap-2'}><Mail className={'text-neutral-400'} size={15}/><p
                        className={'text-sm'}>{email}</p></li>
                    <li className={'flex items-center gap-2'}><Phone className={'text-neutral-400'} size={15}/><p
                        className={'text-sm'}>{cellphone}</p></li>
                    <li className={'flex items-center gap-2'}><Shield className={'text-neutral-400'} size={15}/><p
                        className={'text-sm'}>{designation}</p></li>
                    <li className={'flex items-center gap-2'}><Calendar className={'text-neutral-400'} size={15}/><p
                        className={'text-sm'}>{sing_up_date}</p></li>
                </ul>
                <p className={'text-xs  text-neutral-500'}>Last access: {last_access}</p>
            </div>
            <div className={"w-full h-[90%] flex items-top justify-end"}>
                <section className={'hover:bg-gray-200 px-3 py-3 rounded-2xl'}>
                    <button onClick={deleteUser}><Trash2 color={'red'} size={16}/></button>
                </section>

            </div>

        </article>
    )
}

export function RolesBallons({role, number_of_pages, deleteRoleAndPermissions}) {
    const [numberOfPagesWithPermissions, setNumberOfPagesWithPermissions] = useState(0)

    useEffect(() => {
        async function fetchNumberOfPagesWithPermissions() {
            const number_of_pages_response = await requests.onPost("permissions/count/modules", {role_id: role.id})
            console.log(number_of_pages_response.data[0]?.total_permissions_modules)
            setNumberOfPagesWithPermissions(number_of_pages_response.data[0]?.total_permissions_modules)
        }

        fetchNumberOfPagesWithPermissions().then()
    }, [])
    return (
        <article
            className={"grid grid-flow-col grid-rows-[auto_1fr] w-full gap-3 bg-bg-secondary-color border border-bg-secondary-destack-color rounded-xl p-5"}>
            <div className={"w-full flex items-center justify-start gap-3 m-0 p-0"}>
                <section>
                    <h1><Shield/></h1>
                </section>
                <section className={'space-y-1 text-left'}>
                    <h2>{role.name}</h2>
                    <p className={"text-sm"}>{role.description}</p>
                </section>
            </div>
            <div className={"w-full flex flex-col items-start justify-start gap-2"}>
                <ul className={'items-center justify-start space-y-2'}>
                    <li className={'flex items-center justify-between gap-2'}><Mail size={15}/><p
                        className={'text-xs px-2'}>Módulos com permissão:</p> <p
                        className={'bg-bg-secondary-destack-color text-sm rounded-md px-1'}>{numberOfPagesWithPermissions ? numberOfPagesWithPermissions : "0"} de {number_of_pages}</p>
                    </li>
                </ul>
            </div>
            <div className={"w-full h-[90%] flex items-top justify-end"}>
                <section className={'hover:bg-gray-200 px-3 py-3 rounded-2xl'}>
                    <button onClick={deleteRoleAndPermissions}><Trash2 color={'red'} size={16}/></button>
                </section>

            </div>

        </article>
    )
}

// ─── BranchBallon ──────────────────────────────────────────────────────────────
// Props:
//   branch        { id, name, owner, sector_name, institution_name }
//   memberCount   número de membros (opcional)
//   onDelete      () => void

export function BranchBallon({ branch, memberCount, onDelete }) {
    return (
        <article className="grid grid-flow-col grid-rows-[auto_1fr] w-full gap-3 bg-bg-secondary-color border border-bg-secondary-destack-color rounded-xl p-5">
            {/* cabeçalho */}
            <div className="w-full flex items-center justify-start gap-3">
                <section>
                    <span className="h-fit bg-black text-primary-titles-color rounded-2xl px-2 py-1 text-sm font-bold">
                        {branch.name?.slice(0, 2).toUpperCase() ?? "BR"}
                    </span>
                </section>
                <section className="space-y-0.5 text-left">
                    <h2 className="font-semibold">{branch.name}</h2>
                    <p className="text-xs text-neutral-500">{branch.institution_name}</p>
                </section>
            </div>

            {/* detalhes */}
            <div className="w-full flex flex-col items-start justify-start gap-2">
                <ul className="space-y-2 w-full">
                    <li className="flex items-center gap-2">
                        <User className="text-neutral-400" size={15} />
                        <p className="text-sm">{branch.owner ?? "—"}</p>
                    </li>
                    <li className="flex items-center gap-2">
                        <Layers className="text-neutral-400" size={15} />
                        <p className="text-sm">{branch.sector_name ?? "—"}</p>
                    </li>
                    {memberCount !== undefined && (
                        <li className="flex items-center gap-2">
                            <Building2 className="text-neutral-400" size={15} />
                            <p className="text-sm">{memberCount} membro{memberCount !== 1 ? "s" : ""}</p>
                        </li>
                    )}
                </ul>
            </div>

            {/* ações */}
            <div className="w-full h-full flex items-start justify-end">
                <section className="hover:bg-gray-200 px-3 py-3 rounded-2xl">
                    <button onClick={onDelete} aria-label="Excluir filial">
                        <Trash2 color="red" size={16} />
                    </button>
                </section>
            </div>
        </article>
    );
}

// ─── SectorBallon ─────────────────────────────────────────────────────────────
// Props:
//   sector        { id, name, sectorial_cordenator, vice_sectorial_cordenator, institution_name }
//   branches      [{ id, name }]  — lista de filiais do setor (opcional)
//   onDelete      () => void

export function SectorBallon({ sector, branches = [], onDelete }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <article className="grid grid-flow-col grid-rows-[auto_1fr] w-full gap-3 bg-bg-secondary-color border border-bg-secondary-destack-color rounded-xl p-5">
            {/* cabeçalho */}
            <div className="w-full flex items-center justify-start gap-3">
                <section>
                    <span className="h-fit bg-black text-primary-titles-color rounded-2xl px-2 py-1 text-sm font-bold">
                        {sector.name?.slice(0, 2).toUpperCase() ?? "SE"}
                    </span>
                </section>
                <section className="space-y-0.5 text-left">
                    <h2 className="font-semibold">{sector.name}</h2>
                    <p className="text-xs text-neutral-500">{sector.institution_name}</p>
                </section>
            </div>

            {/* detalhes */}
            <div className="w-full flex flex-col items-start gap-2">
                <ul className="space-y-2 w-full">
                    <li className="flex items-center gap-2">
                        <User className="text-neutral-400" size={15} />
                        <p className="text-sm">{sector.sectorial_cordenator ?? "—"}</p>
                    </li>
                    {sector.vice_sectorial_cordenator && (
                        <li className="flex items-center gap-2">
                            <User className="text-neutral-400" size={15} />
                            <p className="text-sm text-neutral-500">{sector.vice_sectorial_cordenator}</p>
                        </li>
                    )}
                    <li className="flex items-center gap-2">
                        <Building2 className="text-neutral-400" size={15} />
                        <p className="text-sm">
                            {branches.length} filial{branches.length !== 1 ? "is" : ""}
                        </p>
                        {branches.length > 0 && (
                            <button
                                onClick={() => setExpanded(v => !v)}
                                className="ml-auto flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-800"
                                aria-label={expanded ? "Recolher filiais" : "Ver filiais"}
                            >
                                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                {expanded ? "Recolher" : "Ver filiais"}
                            </button>
                        )}
                    </li>
                </ul>

                {/* lista expandida de filiais */}
                {expanded && branches.length > 0 && (
                    <ul className="w-full mt-1 space-y-1 border-t border-bg-secondary-destack-color pt-2">
                        {branches.map(b => (
                            <li key={b.id} className="flex items-center gap-2 text-xs text-neutral-600">
                                <MapPin size={12} className="text-neutral-400" />
                                {b.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* ações */}
            <div className="w-full h-full flex items-start justify-end">
                <section className="hover:bg-gray-200 px-3 py-3 rounded-2xl">
                    <button onClick={onDelete} aria-label="Excluir setor">
                        <Trash2 color="red" size={16} />
                    </button>
                </section>
            </div>
        </article>
    );
}
