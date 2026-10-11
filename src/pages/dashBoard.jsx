import Menu from '../components/menu.jsx';
import Header from '../components/header.jsx';
import Balons from '../components/balons.jsx';
import Graphics from '../components/graphics.jsx';
import DateFilterDropdown from '../components/DateFilterDropdown.jsx';
import { BadgeDollarSign } from 'lucide-react';
import MainRequests from "../services/requests.js";
import { useEffect, useState } from "react";
import { MenuProvider } from "../context/menuContext.jsx";
import SideMenu from "../components/sideMenu.jsx";

const requests = new MainRequests();

function DashBoard() {
    const [sumRevenues, setSumRevenues] = useState(0);
    const [sumExpenses, setSumExpenses] = useState(0);

    // período padrão: mês atual (igual ao original)
    const [period, setPeriod] = useState({
        start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
        end_date:   new Date().toISOString(),
    });

    async function onGetFinanceData(start_date, end_date) {

        const revenues_reports = await requests.onGet(`revenues/${start_date}/${end_date}`, "");
        const expenses_reports = await requests.onGet(`expenses/${start_date}/${end_date}`, "");
        console.log(revenues_reports)
        console.log(expenses_reports);
        setSumRevenues(revenues_reports[0]?.revenues_sum);
        setSumExpenses(expenses_reports[0]?.expenses_sum);



    }

    useEffect(() => {
        setSumRevenues(0);
        setSumExpenses(0);

        onGetFinanceData(period.start_date, period.end_date).then();
    }, [period]);

    const handlePeriodChange = ({ start_date, end_date }) => {
        setPeriod({ start_date, end_date });
    };


    return (
        <div className='justify-center items-center h-[90vh] w-screen'>
            <MenuProvider>
                <Header/>
                <SideMenu/>
            </MenuProvider>
            <Menu/>

            <div className='flex justify-center'>
                <section className='flex flex-col mt-8 gap-3 w-[80vw] md:w-[55vw]'>

                    {/* barra de filtro */}
                    <div className="flex justify-end">
                        <DateFilterDropdown
                            defaultPeriodKey="this_month"
                            onApply={handlePeriodChange}
                        />
                    </div>

                    {/* balons */}
                    <div className="flex flex-col gap-3 md:flex-row">
                        <Balons
                            title={'Entradas'}
                            value={sumRevenues > 0 ? sumRevenues : 0}
                            description={'total de entradas'}
                            icon={<BadgeDollarSign />}
                            color="green"
                        />
                        <Balons
                            title={'Despesas'}
                            value={sumExpenses > 0 ? sumExpenses : 0}
                            description={'total de despesas'}
                            icon={<BadgeDollarSign />}
                            color="green"
                        />
                    </div>
                </section>
            </div>

            <section className="flex justify-center m-auto w-[80vw] md:w-[55vw]">
                <Graphics
                    title={'Grafico teste'}
                    description={'Estou testando o modelo de gráfico'}
                    grafic={'Gráfico'}
                />
            </section>
        </div>
    );
}

export default DashBoard;
