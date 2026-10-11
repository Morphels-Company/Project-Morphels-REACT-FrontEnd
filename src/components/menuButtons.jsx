import { useLocation } from "react-router-dom";

export function MenuButtonsPrimaryBar(props) {
  const location = useLocation();
  const isActive = location.pathname === props.to;

  return <button className={`w-full flex h-10 gap-3 text-sm justify-center items-center py-1 hover:bg-bg-secondary-destack-color ${ isActive ? 'bg-bg-secondary-destack-color' : 'bg-transparent'} md:  hover: rounded-sm`} {...props}>{props.children}</button>
  
}

export function MenuButtonsSideBar(props) {
    const location = useLocation();
    const isActive = location.pathname === props.to;

    return <button className={`w-80 flex h-10 gap-3 text-sm justify-normal items-center pl-10 py-6 mx-3 mb-1  hover:bg-bg-secondary-color ${ isActive ? 'bg-bg-secondary-destack-color' : 'bg-transparent'} md:  hover: rounded-xl`} {...props}>{props.children}</button>


}
