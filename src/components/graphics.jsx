import Header2 from "./header2.jsx";
import {Line} from 'react-chartjs-2'
import {Chart, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend} from "chart.js";

Chart.register(
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale, Title,
    Tooltip,
    Legend
)
function Graphics({title, description}) {
  return (
      <div className="flex flex-col justify-center w-full mt-6 p-4 bg-bg-secondary-color border border-bg-secondary-color rounded-lg shadow-md">
        <Header2 title={title} description={description}/>
        <section>
            {/*<Line options={} data= {}/>*/}
        </section>
      </div>
  )
}
export default Graphics;