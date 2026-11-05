import Header2 from "./header2.jsx";
import FormButtons from "./formButtons.jsx";
import OpenFromButton from "./openFromButton.jsx";
import DataBalloons from "./dadaBalons.jsx";
import SearchArea from "./searchArea.jsx";
import { Search } from "lucide-react";
function Table({header_title, header_description, button_title, datas}) {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col justify-center w-[55vw] mt-8 p-4 bg-white border border-neutral-200 rounded-lg shadow-md gap-5">
        <section className="flex justify-between items-center">
          <Header2
            title={header_title}
            description={header_description}
          />
          <OpenFromButton>{button_title}</OpenFromButton>
        </section>
        <SearchArea placeholder={"Search by description or member..."} />
        {datas.map((data) => (
          <DataBalloons
            key={data.id}
            category={data.category}
            date={data.date}
            title={data.title}
            value={data.value}
            description={data.description}
            color_value={data.color_value}
            color_category={data.color_category}
          />
          ))}
      </div>
    </div>
  );
}

export default Table;
