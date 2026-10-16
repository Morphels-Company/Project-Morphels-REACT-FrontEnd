import { Church, Menu } from 'lucide-react'
import { useMenu } from "../context/menuContext.jsx";
import ThemeToggle from './themeToggle.jsx'

function Header() {
  const { toggleMenu } = useMenu();
  return (
    <>
      <div className='flex justify-center items-center border-b bg-b h-[6vh] w-sceen'>
        <section className='flex justify-between w-[80vw] md:w-[55vw]'>
          <nav className='flex  items-center space-x-3 m-2'>
            <button onClick={toggleMenu} className='p-2 rounded-2xl hover:bg-bg-secondary-destack-color mobile-only-flex'>
              <Menu size={18}/>
            </button>
            <div className=''><Church size={32}/></div>
            <div className='flex flex-col items-baseline'>
              <h1 className='font-bold'>Sistema Financeiro</h1>
              <p className='text-sm text-gray-600'>ADEB</p>
            </div>
          </nav>
          <ThemeToggle/>
        </section>
      </div>
    </>
  )
}
export default Header;