import Menu from "../components/menu.jsx";
import Header from "../components/header.jsx";
import { useState, useEffect } from "react";
import Header2 from "../components/header2.jsx";
import OpenFromButton from "../components/openFromButton.jsx";
import DataBalons from "../components/dadaBalons.jsx";
import SearchArea from "../components/searchArea.jsx";
import SearchBar from "../components/searchBar.jsx";
import { useForm } from "react-hook-form";
import ModalExpenses from "../components/modalExpences.jsx";
import Filt from "../components/filt.jsx";
import MainRequests from "../services/requests.js";
import {MenuProvider} from "../context/menuContext.jsx";
import SideMenu from "../components/sideMenu.jsx";
import Select from "../components/select.jsx";
import Inputs from "../components/inputs.jsx";

const requests = new MainRequests()

function ExpensesPage() {

    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editData, setEditData] = useState(null);
    const [expenses, setExpences] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const [search, setSearch] = useState("")
    const [type, setType] = useState(""),
        [start_date, setStart_date] = useState(""),
        [end_date, setEnd_date] = useState("")
    const [branches, setBranches] = useState([]);

    const { register, handleSubmit } = useForm({
        defaultValues: {
            title: "",
            type: "",
            value: "",
            payment: "",
            date:'',
            branch: "",
            beneficiary:""

        }});

    const onShowForm =  () => {
    setShowForm(!showForm);

    }
    const fetchData = async () => {
        try {
            const expensesResponse = await requests.onGet("expenses", search);
            const branchesResponse = await requests.onGet("branches", search);

            setExpences(expensesResponse);
            setBranches(branchesResponse);
        } catch (error) {
            console.error("Erro ao buscar revenues:", error);
        }
    };

    useEffect (() => {
        fetchData().then();
    }, [search])

    const onSendData = async (data) => {
      await requests.onPost("expenses", data)
      fetchData().then()
    }




    useEffect(() => {
        if (!type && !start_date && !end_date) return;
        async function onFilterExpenses () {
            try {
                const response = await requests.onFilter("expenses", {
                    type,
                    start_date,
                    end_date,
                });
                setExpences(response); // garante que seja array
            } catch (error) {
                console.error("Erro ao filtrar revenues:", error);
            }
        }
        console.log(type)
        onFilterExpenses().then(); //
    },[type, start_date, end_date]);
 

  return (
    <div className="justify-center h-[90vh] w-screen">
        <MenuProvider>
            <Header/>
            <SideMenu/>
        </MenuProvider>
        <Menu/>
      
      <div className="flex justify-center">
        <div className="flex flex-col justify-center mt-8 p-4 bg-bg-secondary-color border border-bg-secondary-destack-color rounded-lg shadow-md gap-5 w-[80vw] md:w-[55vw]">
          <section className="flex justify-between items-center">
            <Header2
              title={"Fomulário de despesas"}
              description={"Formulário para adicionar despesas"}
            />
            <div className="flex justify-center">
              <OpenFromButton onClick={onShowForm}>{showForm ? "Fechar" : "Nova despesa"}</OpenFromButton>
            </div>
          </section>
            <SearchArea placeholder={"Search by description or member..."} showFilter={() => setShowFilter(!showFilter)}
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                        }}/>
            {showFilter && <Filt type={type} start_date={start_date} end_date={end_date}
                                 onChangeType={(e) => setType(e.target.value)}
                                 onChangeStartDate={(e) => setStart_date(e.target.value)}
                                 onChangeEndDate={(e) => setEnd_date(e.target.value)}
                                 options={["Manutenção", "Salários", "Projetos", "Utilidades", "Eventos", "Outros"]}/>}
            {showForm && (
            <div className="bg-bg-secondary-color p-3 rounded-sm border border-bg-secondary-destack-color">
              <form action={handleSubmit(onSendData)} className="flex flex-col  space-y-3">
                <section className="flex flex-col items-start">
                    <Inputs id="title" type="text" children="Titulo" placeholder="Despesa ..."
                            register={{...register("title")}}></Inputs>
                </section>
                
                
                <section className="flex flex-row gap-4 w-full">
                    <Select id={"type"} register={{...register("type")}} title={"Tipo"} options={[
                        {index:"", title:"Selecione uma opção"},
                        {index:"manutencao", title:"Manutencao"},
                        {index:"salario", title:"Salários"},
                        {index:"projetos", title:"Projetos"},
                        {index:"utilidades", title:"Utilidades"},
                        {index:"eventos", title:"Eventos"},
                        {index:"outros", title:"Outros"}
                    ]} />

                    <Inputs id="value" type="number" children="Valor" placeholder="R$ 00,00" step="0.01"
                            register={{...register("value")}}></Inputs>

                </section >
                <section className="flex flex-row gap-4 w-full">
                    <Select id={"payment"} register={{...register("payment")}} title={"Meio de pagamento"} options={[
                        {index:"", title: "Selecione uma opção"},
                        {index:"pix_deposito", title: "Pix/Depósito"},
                        {index:"dinheiro", title: "Dinheiro"},
                        {index:"cheque", title: "Cheque"}
                    ]} />
                    <Inputs id="date" type="date" children="Data"
                            register={{...register("date")}}></Inputs>
                </section >
                <section className="flex flex-col items-start gap-3">
                    <Select id={"branch"} register={{...register("branch")}} title={"Filial"} options={[
                        {index:"", title: "Selecione uma opção"},
                        ...branches.map(branch => ({
                            index: String(branch.id),
                            // Fique de olho: no Postgres você chamou de 'nome', verifique se o JSON da API traz 'nome' ou 'name'
                            title: String(branch.name)
                        }))
                    ]} />
                    <Inputs id="beneficiary" type="text" children="Beneficiado" placeholder="Lojas ABC"
                            register={{...register("beneficiary")}}></Inputs>

                </section>
              
              
                <div className="w-full flex flex-row mt-4 gap-4 ">
                      <button type={"submit"} className="bg-neutral-950 text-white text-xs px-4 py-2 rounded-lg hover:bg-neutral-600 transition-discrete">Submit</button>
                      <button onClick={() => setShowForm(false)} className="bg-white border text-xs border-gray-200 shadow-xs text-black px-4 py-2 rounded-lg hover:bg-slate-200 transition-discrete">Cancel</button>
                  </div>
              </form>
            </div>
          )}
          
          {expenses.map((data) => (
            <DataBalons
              key={data.id}
              type={data.type}
              date={data.date}
              title={data.title}
              value={data.value}
              payment={data.beneficiary}
              color_value={"green"}
              showEditForm={() => {
                setShowEditForm(true);
                setEditData(data);
              }}
              onDelete={async () => {
                  await requests.onDelete("expenses", data.id)
                  fetchData().then()
              }}
            />
          ))}
            {showEditForm && <ModalExpenses
                onGetExpenses={() => fetchData()}
                onHideForm={() => setShowEditForm(!showEditForm)}
                complete={editData}
                branches={branches}
            />}
        </div>
      </div>
    </div>
  );
}

export default ExpensesPage;