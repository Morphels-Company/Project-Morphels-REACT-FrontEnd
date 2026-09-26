import Select from "../components/select.jsx";import NumericInputs from "../components/numericInputs.jsx";
import Inputs from "../components/inputs.jsx";
import {useForm} from "react-hook-form";

function Teste(){
    const {register, watch, setValue, handleSubmit, reset} = useForm({
        defaultValues:{
            member: "",
            type: "",
            value: "",
            payment: "",
            branch: ""
        }
    });
    return(
        <form
            action={() => {
                handleSubmit(async (data) => {
                    try {
                        // await requests.onPost("revenues", data)
                        console.log(data);
                        reset()
                    } catch (error) {
                        console.error(error)
                    }
                })()

            }}
            className="flex flex-col  space-y-3"
        >

                <NumericInputs id="values" type="number" placeholder="R$ 00,00" children="Valor" step="0.01"
                               register={{...register("value")}} format={"(##) # ####-####"}/>
                <Inputs id="values" type="number" placeholder="R$ 00,00" children="Valor" step="0.01"
                        register={{...register("value")}}></Inputs>

            <button type={"submit"}>Enviar</button>

        </form>
    )
}

export default Teste