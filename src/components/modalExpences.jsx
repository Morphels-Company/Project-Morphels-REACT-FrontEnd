import api from '../services/api.js';
import { useForm } from 'react-hook-form';
import SearchBar from './searchBar.jsx';
import Header2 from './header2.jsx';
import Select from "./select.jsx";
import Inputs from "./inputs.jsx";

function ModalExpenses({complete, onHideForm, onGetExpenses, branches}) {
  const formatedData = complete ? {
    ...complete,
    date: complete.date.split('T')[0],
  } : complete;

  const { register, handleSubmit} = useForm({
    values: formatedData
  });


    async function onEditExpense(data) {
      console.log(data);
      await api.put(`/expenses/${complete.id}`, data)
      onGetExpenses()
      onHideForm()
    }
  return (
    <div className="fixed inset-0 bg-[rgb(0,0,0,0.7)] bg-opacity-50 flex items-center justify-center">
      <div className="flex flex-col bg-bg-secondary-color w-[80vw] p-6 rounded-lg shadow-lg space-y-4 md:w-[55%]">
        <Header2
              title={"Expenses put Form"}
              description={"Form to edit expenses"}
        />
        <form action={() => handleSubmit(onEditExpense)()} className="flex flex-col  space-y-3">
          <section className="flex flex-col items-start">
            <Inputs id="title" type="text" placeholder="Despesa..." children="Titulo"
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
            <Inputs id="value" type="number" step="0.01" placeholder="R$ 00,00" children="Valor"
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
            <button
              type="submit"
              className="bg-neutral-950 text-white text-xs px-4 py-2 rounded-lg hover:bg-neutral-600 transition-discrete"
            >
              Submit
            </button>
            <button
              onClick={onHideForm}
              className="bg-white border text-xs border-gray-200 shadow-xs text-black px-4 py-2 rounded-lg hover:bg-slate-200 transition-discrete"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalExpenses;
