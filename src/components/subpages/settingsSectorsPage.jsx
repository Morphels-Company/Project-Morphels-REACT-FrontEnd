import { SectorBallon } from "../settingsBallons.jsx";
import { useEffect, useState } from "react";
import MainRequests from "../../services/requests.js";
import {Loader2, Plus} from "lucide-react";
import { useForm } from "react-hook-form";
import Inputs from "../inputs.jsx";
import Header2 from "../header2.jsx";

const request = new MainRequests();

export default function SectorsPage() {
    const [sectors, setSectors]             = useState([]);
    const [branchesBySector, setBranchesBySector] = useState({});
    const [showForm, setShowForm]           = useState(false);

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            name: "",
            sectorial_cordenator: "",
            vice_sectorial_cordenator: ""
        }
    });

    const fetchAll = async () => {
        const [sectorRes, branchRes] = await Promise.all([
            request.onGet("sectors"),
            request.onGet("branches"),
        ]);
        setSectors(sectorRes ?? []);

        const grouped = {};
        (branchRes ?? []).forEach(b => {
            if (!grouped[b.sector]) grouped[b.sector] = [];
            grouped[b.sector].push(b);
        });
        setBranchesBySector(grouped);
    };

    useEffect(() => { fetchAll(); }, []);

    const onCreateSector = async (data) => {
        await request.onPost("sectors", data);
        reset();
        setShowForm(false);
        fetchAll();
    };

    const onDeleteSector = async (id) => {
        await request.onDelete("sectors", id);
        fetchAll();
    };

    return (
        <main className="flex flex-col items-center justify-center">

            <div className="flex w-[55vw] justify-between items-center py-6">
                <section className="flex flex-col items-start">
                    <h1 className="text-2xl">Setores</h1>
                    <h2 className="text-sm text-neutral-500">Gerencie os setores da organização</h2>
                </section>
                <section>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex gap-2 bg-black text-secondary-titles-color text-sm p-2 rounded-md items-center"
                    >
                        <Plus size={16} />
                        <p>Novo Setor</p>
                    </button>
                </section>
            </div>

            {sectors.length === 0 ??
                <div className="justify-center h-screen w-full">
                    <div className="w-full h-[20%] flex flex-col justify-center items-center space-x-3">
                        <Loader2 className="animate-spin w-40 h-40"/>
                        <h2>Carregando...</h2>
                    </div>
                </div>
            }

            <div className="grid grid-cols-1 gap-2 w-[80vw] md:w-[55vw] xl:grid-cols-2 2xl:grid-cols-3">
                {sectors.map(sector => (
                    <SectorBallon
                        key={sector.id}
                        sector={sector}
                        branches={branchesBySector[sector.id] ?? []}
                        onDelete={() => onDeleteSector(sector.id)}
                    />
                ))}
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-[rgb(0,0,0,0.7)] flex items-center justify-center">
                    <div className="flex flex-col bg-bg-secondary-color h-[70%] w-[80%] md:w-[33%] p-6 rounded-lg shadow-lg space-y-4 overflow-auto">
                        <form
                            action={() => handleSubmit(onCreateSector)()}
                            className="flex flex-col space-y-3"
                        >
                            <Header2
                                title="Novo Setor"
                                description="Preencha os dados do setor"
                            />

                            <section className="flex flex-col gap-4 w-full pb-4 border-b-2 border-bg-secondary-destack-color">
                                <Inputs
                                    id="sector-name"
                                    type="text"
                                    placeholder="Ex: Setor Norte"
                                    register={{ ...register("name") }}
                                >
                                    Nome *
                                </Inputs>

                                <Inputs
                                    id="sector-coord"
                                    type="text"
                                    placeholder="Ex: Maria Souza"
                                    register={{ ...register("sectorial_cordenator") }}
                                >
                                    Coordenador *
                                </Inputs>

                                <Inputs
                                    id="sector-vice"
                                    type="text"
                                    placeholder="Ex: Carlos Lima (opcional)"
                                    register={{ ...register("vice_sectorial_cordenator") }}
                                >
                                    Vice-coordenador
                                </Inputs>
                            </section>

                            <div className="w-full flex flex-row mt-4 gap-4">
                                <button
                                    type="submit"
                                    className="bg-neutral-950 text-white text-xs px-4 py-2 rounded-lg hover:bg-neutral-600 transition-discrete"
                                >
                                    Salvar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { reset(); setShowForm(false); }}
                                    className="bg-white border text-xs border-gray-200 shadow-xs text-black px-4 py-2 rounded-lg hover:bg-slate-200 transition-discrete"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
