import './App.css'
import{ Church, Mail, Lock } from "lucide-react"
import SearchBar from './components/searchBar.jsx';
import Inputs from "./components/inputs.jsx";
import { useNavigate } from 'react-router-dom';
import MainRequests from "../src/services/requests.js";
import {useForm} from 'react-hook-form';

const request = new MainRequests()


function App() {
    const navigate = useNavigate()
    const {register, handleSubmit} = useForm();

    async function onCheckLogin(data) {
        try{
            const response = await request.onLogin("users", data);
            if (response.success === false) {
                alert("Usuário não encontrado!")
            }
            navigate(`${response.route}`)
        }catch(error){
            console.log(error)
        }
}
  return(
    <main className="flex flex-col justify-center items-center h-screen w-screen gap-4 bg-[url('../images/adebBackground.jpg')] bg-cover bg-center bg-black/30 bg-blend-darken">
      <div className="flex flex-col justify-center items-center bg-bg-primary-color backdrop-blur-md p-10 rounded-lg shadow-lg w-85 gap-4 md:w-110">
        <header className="flex flex-col justify-center items-center gap-2">
          <i className='bg-bg-secondary-color p-4 rounded-full'>
            <Church  size={40}/>
          </i>
          <h1 className="text-center text-2xl mt-2 mb-2">Morphels</h1>
          <h3 className='text-sm text-gray-500'>Assembleia de Deus de Brasilia</h3>
          <h3 className='text-sm text-gray-500'>Faça login para acessar o painel</h3>
        </header>
        <form action={() => handleSubmit(onCheckLogin)()} className='flex flex-col gap-4 w-full'>
          <section className='flex flex-col items-start w-full gap-3'>
              <Inputs id="email" type="email" placeholder="jonas@gmail..." children="Email"
                      register={{...register("loginEmail")}}></Inputs>
              <Inputs id="password" type="text" placeholder="123..." children="Senha"
                      register={{...register("loginPassword")}}></Inputs>
          </section>
          <section className='flex flex-col w-full'>
            <article className='flex justify-between w-full mb-4 text-gray-950'>
              <div className='flex items-center'>
                <input type="checkbox" name="lembreme" id="lembreme"/>
                <label htmlFor="lembreme" className='text-sm text-primary-titles-color ml-2'>Lembre-me</label>
              </div>
              <a href="#" className='hover:underline'>Esqueci a senha</a>
            </article>
            <button type='submit' className='bg-buttons-color hover:bg-buttons-hover text-secondary-titles-color rounded-sm p-1'>Entrar</button>
          </section>
        </form>
      </div>
    </main>
  )
}
  

export default App
