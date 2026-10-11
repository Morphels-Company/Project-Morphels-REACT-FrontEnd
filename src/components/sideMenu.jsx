import { ChartColumn, BadgeDollarSign, Receipt, FileText, Settings, Users, X } from 'lucide-react';
import { MenuButtonsSideBar } from './menuButtons.jsx';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useMenu } from "../context/menuContext.jsx";
import MainRequests from "../services/requests.js";

const requests = new MainRequests();
function SideMenu() {
    const navigate = useNavigate()
    const { isOpen, toggleMenu } = useMenu();
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
            title: "Revenues",
        },
        expenses: {
            path: "/expenses",
            icon: <Receipt size={14}/>,
            title: "Expenses",
        },
        register: {
            path: "/register",
            icon: <Users size={14}/>,
            title: "Register",
        },
        reports: {
            path: "/reports",
            icon: <FileText size={14}/>,
            title: "Reports",
        },
        settings: {
            path: "/settings",
            icon: <Settings size={14}/>,
            title: "Settings",
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
        <div
            className={`fixed inset-0 z-50 bg-black/70 flex items-start justify-start mobile-only-block transition-opacity duration-300 ${
                isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
        >
            <div
                className={`flex flex-col bg-bg-primary-color w-85 h-full rounded-lg shadow-lg space-y-4 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <section className="flex w-full items-center justify-between my-3 px-3">
                    <h2 className='text-2xl pl-3'>Menu de páginas</h2>
                    <button
                        className="p-1 hover:bg-bg-secondary-destack-color text-primary-titles-color items-center rounded-2xl"
                        onClick={toggleMenu}
                    >
                        <X/>
                    </button>
                </section>
                <ul className='w-full flex flex-col items-center'>
                    {pagesPermissions.map((page) => {
                            if (page.can_view === true && presetPages[page.page_name] !== undefined) {
                                return (
                                    <li key={page.page_name} className='w-full'>
                                        <MenuButtonsSideBar to={presetPages[page.page_name]?.path} onClick={() => navigate(presetPages[page.page_name]?.path)}>
                                            {presetPages[page.page_name]?.icon} {presetPages[page.page_name]?.title}
                                        </MenuButtonsSideBar>
                                    </li>
                                )
                            }
                        }
                    )}
                </ul>
            </div>
        </div>
    )
}
export default SideMenu;