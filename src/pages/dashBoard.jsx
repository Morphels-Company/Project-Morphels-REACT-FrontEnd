import Balloons from '../components/balloons.jsx';
import Graphics from '../components/graphics.jsx';
import DateFilterDropdown from '../components/DateFilterDropdown.jsx';
import AppLayout from '../components/appLayout.jsx';
import { BadgeDollarSign, ChartColumn } from 'lucide-react';
import MainRequests from "../services/requests.js";
import { useEffect, useState } from "react";

const requests = new MainRequests();

function DashBoard() {
    const [sumRevenues, setSumRevenues] = useState(0);
    const [sumExpenses, setSumExpenses] = useState(0);

    // período padrão: mês atual (igual ao original)
    const [period, setPeriod] = useState({
        start_date: new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), 1)).toISOString(),
        end_date:   new Date().toISOString(),
    });

    async function onGetFinanceData(start_date, end_date) {
        const revenues_reports = await requests.onGet(`revenues/${start_date}/${end_date}`, "");
        const expenses_reports = await requests.onGet(`expenses/${start_date}/${end_date}`, "");
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
        <AppLayout
            title="Dashboard"
            icon={<ChartColumn size={16}/>}
            orgName="ADEB"
            headerRight={
                <DateFilterDropdown
                    defaultPeriodKey="this_month"
                    onApply={handlePeriodChange}
                />
            }
        >
            {/* balões */}
            <div className="flex flex-col gap-3 md:flex-row">
                <Balloons
                    title={'Entradas'}
                    value={sumRevenues > 0 ? sumRevenues : 0}
                    description={'Total de entradas'}
                    icon={<BadgeDollarSign />}
                    color="green"
                />
                <Balloons
                    title={'Despesas'}
                    value={sumExpenses > 0 ? sumExpenses : 0}
                    description={'Total de despesas'}
                    icon={<BadgeDollarSign />}
                    color="green"
                />
                <Balloons
                    title={'Saldo'}
                    value={isNaN((sumRevenues - sumExpenses)) ? 0 : (sumRevenues - sumExpenses)}
                    description={'Total disponível'}
                    icon={<BadgeDollarSign />}
                    color="green"
                />
            </div>

            <Graphics
                title={'Grafico teste'}
                description={'Estou testando o modelo de gráfico'}
                grafic={'Gráfico'}
            />
        </AppLayout>
    );
}

export default DashBoard;
