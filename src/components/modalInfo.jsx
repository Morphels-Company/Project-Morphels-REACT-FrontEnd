import IforParagraf from './infoParagraf.jsx';
import { Building2, X } from 'lucide-react';

function ModalInfo({selectedCompanyInfo, setShowInfo}) {

  const dataObj = new Date(selectedCompanyInfo.open_date);

    const formatedData = dataObj.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })

    return(<div className="fixed inset-0 bg-[rgb(0,0,0,0.7)] bg-opacity-50 flex items-center justify-center">
      <div className="flex flex-col bg-bg-secondary-color h-[70%] w-[80%] md:w-[55%] p-6 rounded-lg shadow-lg space-y-4 overflow-auto">
        <section className="flex justify-between items-center">
          <nav className="flex flex-col items-baseline">
            <section className='flex gap-2 items-center '>
              <Building2 />
              <h2 className="text-lg">Complete Company's Information</h2>
            </section>
            <p className="text-gray-500 text-sm">Complete register data to fiscal note</p>
          </nav>
            <button onClick={setShowInfo} className=" text-gray-500 text-xs px-2 py-2 mt-4 rounded-lg hover:bg-neutral-200 transition-discrete"><X size={20}/></button>
        </section>

        <div className="">
          <section className="flex items-center gap-2 mb-4">
            <Building2 size={18} />
            <h3 className="font-semibold  text-sm">Company Information</h3>
          </section>

          <section className="grid grid-cols-2 gap-4 items-start ">
           

            <IforParagraf title="Company Name:" info={selectedCompanyInfo.company_name} />
            <IforParagraf title="Fantasy Name:" info={selectedCompanyInfo.fantasy_name} />
            <IforParagraf title="CNPJ:" info={selectedCompanyInfo.cnpj} />
            <p className='flex flex-col items-start'><strong className='text-neutral-400 text-sm'>Situação Cadastral</strong> <span className=' bg-black text-white text-[16px] px-1 rounded-md'>{selectedCompanyInfo.situation}</span></p>
            <IforParagraf title="Opening Date:" info={formatedData} />
            <IforParagraf title="State Registration:" info={selectedCompanyInfo.state_registration} />
            <IforParagraf title="Municipal Registration:" info={selectedCompanyInfo.municipal_registration} />
            
            
            
          </section>
          <hr className='w-[80%] m-auto text-neutral-300 my-5'></hr>

          <section className="flex items-center gap-2 mb-4">
            <Building2 size={18} />
            <h3 className="font-semibold  text-sm">Company Information</h3>
          </section>
          <section className="grid grid-cols-2 gap-4 items-start ">
            <IforParagraf title="Logadouro" info={`${selectedCompanyInfo.street}, ${selectedCompanyInfo.number}, ${selectedCompanyInfo.complement}`} />
            <IforParagraf title="Bairro" info={selectedCompanyInfo.neighborhood}/>
            <IforParagraf title="CEP:" info={selectedCompanyInfo.cep} />
            <IforParagraf title="Cidade" info={selectedCompanyInfo.city} />
            <IforParagraf title="UF:" info={(selectedCompanyInfo.uf || "").toUpperCase()} />
            
          </section>

           <hr className='w-[80%] m-auto text-neutral-300 my-5'></hr>

           <section className="flex items-center gap-2 mb-4">
            <Building2 size={18} />
            <h3 className="font-semibold  text-sm">Contact</h3>
          </section>
          <section className="grid grid-cols-2 gap-4 items-start ">
            <IforParagraf title="Cellphone" info={selectedCompanyInfo.cellphone} />
            <IforParagraf title="E-mail" info={selectedCompanyInfo.email}/>
          </section>

          <hr className='w-[80%] m-auto text-neutral-300 my-5'></hr>

          <section className="flex items-center gap-2 mb-4">
            <Building2 size={18} />
            <h3 className="font-semibold  text-sm">Contact</h3>
          </section>
          <section className="grid grid-cols-1 gap-4 items-start ">
            <IforParagraf title="CNAE" info={selectedCompanyInfo.cnae} />
            <IforParagraf title="Activity's Description" info={selectedCompanyInfo.activity_description}/>
          </section>

          <hr className='w-[80%] m-auto text-neutral-300 my-5'></hr>

          <section className="flex items-center gap-2 mb-4">
            <Building2 size={18} />
            <h3 className="font-semibold  text-sm">Contact</h3>
          </section>
          <section className="grid grid-cols-2 gap-4 items-start ">
            <IforParagraf title="PIX Key type" info={selectedCompanyInfo.pixtype} />
            <IforParagraf title="PIX Key" info={selectedCompanyInfo.pixkey}/>
          </section>


        </div>
      </div>
    </div>
  );
}

export default ModalInfo;
