import Menu from '../components/menu.jsx';
import Header from '../components/header.jsx';
import Balons from '../components/balons.jsx';
import Graphics from '../components/graphics.jsx';
import { BadgeDollarSign } from 'lucide-react';
import MainRequests from "../services/requests.js";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {MenuProvider} from "../context/menuContext.jsx";
import SideMenu from "../components/sideMenu.jsx";

const requests = new MainRequests();

function DashBoard () {
    const navigate = useNavigate();
    const [sumRevenues, setSumRevenues] = useState(0);
    const [sumExpenses, setSumExpenses] = useState(0);

    async function onGetFinanceData (){
        const start_date = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        const end_date = new Date()
        const finance_response = await requests.onPost(`dashboard`, {start_date, end_date});

        console.log(finance_response);

        setSumExpenses(finance_response.data.expenses);
        setSumRevenues(finance_response.data.revenues);
    }

    useEffect(() => {
        onGetFinanceData().then();

    }, [])


  return (
    
    <div className='justify-center items-center h-[90vh] w-screen'>
        <MenuProvider>
            <Header/>
            <SideMenu/>
        </MenuProvider>
        <Menu/>

      <div className='flex justify-center'>
        <section className='flex flex-col mt-8 gap-3 w-[80vw] md:w-[55vw] md:flex-row'>
          <Balons title={'Entradas'} value={sumRevenues?.length > 0 ? sumRevenues : 0} description={'total de entradas'} icon={<BadgeDollarSign />} color="green"/>
          <Balons title={'Despesas'} value={sumExpenses?.length > 0 ? sumExpenses : 0} description={'total de despesas'} icon={<BadgeDollarSign />} color="green"/>
        </section>
      </div>
      <section className="flex justify-center m-auto w-[80vw] md:w-[55vw]">
        <Graphics title={'Grafico teste'} description={'Estou testando o modelo de gráfico'} grafic={'Gráfico'} />
      </section>
    </div>
  )}
  
export default DashBoard