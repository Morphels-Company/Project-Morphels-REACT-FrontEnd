import { useForm } from "react-hook-form";
import api from "../services/api.js";
import SearchBar from "./searchBar.jsx";
import Header2 from "./header2.jsx";
import Select from "./select.jsx";
import Inputs from "./inputs.jsx";

function ModalRevenues({ complete, onHideForm, onGetRevenues, branches }) {
  const formatedData = complete ? {
    ...complete,
    date: complete.date?.split("T")[0],
  } : complete;

  const { register, handleSubmit } = useForm({
    values: formatedData
  });

  console.log(complete)

  async function onEditRevenue(data) {
    await api.put(`/revenues/${complete.id}`, data);
    onGetRevenues();
    onHideForm();
  }
  return (
    <div className="fixed inset-0 bg-[rgb(0,0,0,0.7)] bg-opacity-50 flex items-center justify-center">
      <div className="flex flex-col bg-bg-secondary-color p-6 rounded-lg shadow-lg space-y-4 w-[80vw] md:w-[55vw]">
        <Header2
          title={"Revenues put Form"}
          description={"Form to edit revenues"}
        />
        <form
          action={() => handleSubmit(onEditRevenue)()}
          className="flex flex-col  space-y-3"
        >
          <section className="flex flex-col items-start">
            <Inputs id="member" type="text" placeholder="Jose..." children="Membro"
                    register={{...register("member")}}></Inputs>
          </section>

          <section className="flex flex-row gap-4 w-full">
            <Select id={"type"} register={{...register("type")}} title={"Tipo"} options={[
              {index:"", title: "Selecione uma opção"},
              {index:"doação", title: "Doação"},
              {index:"contribuicao_regular", title: "Contribuição Regular"},
              {index:"oferta_especial", title: "Oferta Especial"},
              {index:"subvencao", title: "Subvenção/Subsídio"},
              {index:"patrocinio", title: "Patrocínio"},
              {index:"venda_serviço", title: "Venda/Serviço"},
              {index:"mensalidade", title: "Mensalidade"},
              {index:"rendimento_financeiro", title: "Rendimento financeiro"},
              {index:"outros", title: "Outros"},

            ]} />
            <Inputs id="values" type="number" placeholder="R$ 00,00" children="Valor" step="0.01"
                    register={{...register("value")}}></Inputs>
          </section>
          <section className="flex flex-row gap-4 w-full">
            <Select id={"payment"} register={{...register("payment")}} title={"Meio de pagamento"} options={[
              {index:"", title: "Selecione uma opção"},
              {index:"pix_deposito", title: "Pix/Depósito"},
              {index:"dinheiro", title: "Dinheiro"},
              {index:"cheque", title: "Cheque"}
            ]} />
            <Inputs id="date" type="date" children="Data"
                    register={{...register("date")}}></Inputs>
          </section>
          <section className="flex flex-col items-start">
            <Select id={"branch"} register={{...register("branch")}} title={"Filial"} options={[
              {index:"", title: "Selecione uma opção"},
              ...branches.map(branch => ({
                index: String(branch.id),
                title: String(branch.name)
              }))
            ]} />

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

export default ModalRevenues;
