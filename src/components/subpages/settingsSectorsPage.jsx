import { SectorBallon } from "../settingsBallons.jsx";
import { useEffect, useState } from "react";
import MainRequests from "../../services/requests.js";
import {Loader2, Plus} from "lucide-react";
import { useForm } from "react-hook-form";
import Inputs from "../inputs.jsx";
import Header2 from "../header2.jsx";
import FormButtons from "../formButtons.jsx";

const request = new MainRequests();

export default function SectorsPage() {
    const [sectors, setSectors]             = useState([]);
    const [branchesBySector, setBranchesBySector] = useState({});
    const [showForm, setShowForm]           = useState(false);
    const [isLoading, setIsLoading ] = useState(true);

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            name: "",
            sectorial_cordenator: "",
            vice_sectorial_cordenator: ""
        }
    });

    const fetchAll = async () => {
        try {
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
        }catch (error){
            console.log(error);
        }finally {
            setIsLoading(false);
        }

    };

    useEffect(() => {
        setIsLoading(true);
        fetchAll().then();
    }, []);

    const onCreateSector = async (data) => {
        await request.onPost("sectors", data);
        reset();
        setShowForm(false);
        fetchAll().then();
    };

    const onDeleteSector = async (id) => {
        await request.onDelete("sectors", id);
        fetchAll().then();
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
                        className="flex gap-2 bg-black text-white text-sm p-2 rounded-md items-center"
                    >
                        <Plus size={16} />
                        <p>Novo Setor</p>
                    </button>
                </section>
            </div>

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
            {isLoading &&
                <div className="justify-center w-full">
                    <div className=" flex flex-col justify-center items-center space-x-3">
                        <Loader2 className="animate-spin w-20 h-20"/>
                        <h2>Carregando...</h2>
                    </div>
                </div>
            }

            {showForm && (
                <div className="fixed inset-0 bg-[rgb(0,0,0,0.7)] flex items-center justify-center">
                    <div className="flex flex-col justify-center bg-bg-secondary-color h-[45%] w-[80%] md:w-[33%] p-6 rounded-lg shadow-lg space-y-4 overflow-auto">
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

                            <FormButtons cancelFunction={() => { reset(); setShowForm(false); }} />
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
