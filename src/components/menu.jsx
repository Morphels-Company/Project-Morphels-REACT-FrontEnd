import {ChartColumn, BadgeDollarSign, Receipt, FileText, Settings, Users} from 'lucide-react';
import MenuButtons from './menuButtons.jsx';
import {useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import MainRequests from "../services/requests.js";

const requests = new MainRequests();

function Menu() {
    const navigate = useNavigate()
    const [pagesPermissions, setPagesPermissions] = useState([]);

    const PREFERRED_ORDER = ['dashboard', 'revenues', 'expenses', 'register', 'reports', 'settings'];

    const presetPages = {
        dashboard: {
            path: "/dashboard",
            icon: <BadgeDollarSign size={14}/>,
            title: "Dashboard",
        },
        revenues: {
            path: "/revenues",
            icon: <ChartColumn size={14}/>,
            title: "Receitas",
        },
        expenses: {
            path: "/expenses",
            icon: <Receipt size={14}/>,
            title: "Despesas",
        },
        register: {
            path: "/register",
            icon: <Users size={14}/>,
            title: "Registros",
        },
        reports: {
            path: "/reports",
            icon: <FileText size={14}/>,
            title: "Relatórios",
        },
        settings: {
            path: "/settings",
            icon: <Settings size={14}/>,
            title: "Configurações",
        }
    }

    useEffect(() => {
        async function getPermission() {
            const response_pagesPermissions = await requests.onGet("permissions");
            const sortedPermissions = [...response_pagesPermissions].sort((a, b) => {
                const indexA = PREFERRED_ORDER.indexOf(a.page_name);
                const indexB = PREFERRED_ORDER.indexOf(b.page_name);

                const posA = indexA !== -1 ? indexA : 999;
                const posB = indexB !== -1 ? indexB : 999;

                return posA - posB;
            });

            setPagesPermissions(sortedPermissions);
        }

        getPermission().then()
    }, [])


    return (
        <div className='flex justify-center items-center mt-7 desktop-only-flex'>
            <ul className='w-[55vw] flex flex-row bg-bg-primary-color rounded-sm items-center shadow-lg shadow-bg-secondary-destack-color'>
                {pagesPermissions.map((page) => {
                        if (page.can_view === true && presetPages[page.page_name] !== undefined) {
                            return (
                                <li key={page.page_name} className='w-full'>
                                    <MenuButtons to={presetPages[page.page_name]?.path} onClick={() => navigate(presetPages[page.page_name]?.path)}>
                                        {presetPages[page.page_name]?.icon} {presetPages[page.page_name]?.title}
                                    </MenuButtons>
                                </li>
                            )
                        }
                    }
                )}
            </ul>
        </div>
    )
}

export default Menu;