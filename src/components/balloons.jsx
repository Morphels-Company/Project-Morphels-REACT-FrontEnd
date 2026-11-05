import { FormateMonetaryValue } from "../services/formatService.js";

function Balloons(props) {

  return (
    <div className='flex w-full justify-center mt-0'>
        <section className="flex justify-between border border-bg-secondary-color bg-bg-secondary-color p-5 rounded-lg shadow-md w-full h-35 ">
          <section className="flex flex-col gap-6 items-start pl-2" >
            <h2 className="justify-end">{props.title}</h2>
            <div className="flex flex-col items-start">
              <h1 className={`text-2xl text-${props.color}-400`}>{FormateMonetaryValue(props.value)}</h1>
              <p className="text-gray-500 text-sm">{props.description}</p>
            </div>
          </section>
          <i className="text-gray-600">{props.icon}</i>
        </section>
    </div>
  )
}

export default Balloons;