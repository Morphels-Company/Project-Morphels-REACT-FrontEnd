import { Calendar, Trash2 } from "lucide-react";
import { FormateMonetaryValue } from "../services/formatService.js";

function DataBalloons({
  type,
  date,
  title,
  value,
  payment,
  color_value,
  onDelete,
  showEditForm
}) {
  const cores = {
    red: ["text-red-700", "bg-red-100"],
    green: ["text-green-700", "bg-green-100"],
    blue: ["text-blue-700", "bg-blue-100"],
    yellow: ["text-yellow-700", "bg-yellow-100"],
    purple: ["text-purple-700", "bg-purple-100"],
    gray: ["text-black", "bg-gray-100"],

    // novas
    orange: ["text-orange-700", "bg-orange-100"],
    pink: ["text-pink-700", "bg-pink-100"],
    indigo: ["text-indigo-700", "bg-indigo-100"],
    teal: ["text-teal-700", "bg-teal-100"],
    cyan: ["text-cyan-700", "bg-cyan-100"],
    emerald: ["text-emerald-700", "bg-emerald-100"],
    lime: ["text-lime-700", "bg-lime-100"],
    amber: ["text-stone-700",  "bg-stone-200"],
    rose: ["text-rose-700", "bg-rose-100"],
    sky: ["text-sky-700", "bg-sky-100"],
    violet: ["text-violet-700", "bg-violet-100"],
    fuchsia: ["text-fuchsia-700", "bg-fuchsia-100"],
    slate: ["text-slate-700", "bg-slate-200"],
  };

  if (!type || !date || !title || !value || !payment) {
    return null; // Retorna null se algum dos dados obrigatórios estiver faltando
  }

  let color_category;
  if (type === "doação") {
    color_category = "blue";
  } else if (type === "contribuicao_regular") {
    color_category = "green";
  } else if (type === "oferta_especial") {
    color_category = "purple";
  } else if (type === "subvencao") {
    color_category = "yellow";
  } else if (type === "patrocinio") {
    color_category = "teal";
  } else if (type === "venda_serviço") {
    color_category = "orange";
  } else if (type === "mensalidade") {
    color_category = "indigo";
  } else if (type === "rendimento_financeiro") {
    color_category = "emerald";
  } else if (type === "manutencao") {
    color_category = "amber";
  } else if (type === "salario") {
    color_category = "red";
  } else if (type === "projetos") {
    color_category = "violet";
  } else if (type === "utilidades") {
    color_category = "sky";
  } else if (type === "eventos") {
    color_category = "pink";
  } else {
    color_category = "gray"; // "outros" e qualquer valor desconhecido
  }

  const classeCorValue = cores[color_value] ?? ["text-gray-500", "bg-gray-100"];
  const classeCorCategory = cores[color_category] ?? [
    "text-gray-500",
    "bg-gray-100",
  ];


  const formatedData = new Date(date).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div
      onClick={showEditForm}
      className="flex flex-col justify-center hover:bg-bg-secondary-destack-color border border-bg-secondary-destack-color bg-bg-secondary-color px-4 py-3 rounded-lg gap-1"
    >
      <nav className="flex gap-3">
        <p
          className={`text-xs text-blue-300 ${classeCorCategory[0]} ${classeCorCategory[1]} px-2 py-1 rounded-lg items-center`}
        >
          {type}
        </p>
        <p className="flex items-center text-gray-500 text-xs">
          <Calendar size={13} /> {formatedData}
        </p>
      </nav>

      <div className="flex justify-between items-center">
        <h1 className="text-sm">{title}</h1>
        <div className="flex gap-3 items-center">
          <p className={`text-sl ${classeCorValue[0]}`}>{FormateMonetaryValue(value)}</p>
          <button onClick={(e) => {e.stopPropagation(); onDelete()}} className="text-red-700 p-2 hover:bg-red-100 rounded-lg">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <section className="flex justify-start">
        <p className="text-xs text-gray-500">{payment}</p>
      </section>
    </div>
  );
}
export default DataBalloons;
