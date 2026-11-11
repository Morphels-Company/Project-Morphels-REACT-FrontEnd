import { ChartColumn, BadgeDollarSign, Receipt, FileText, Settings, Users, Church, Moon, LogOut, Sun } from 'lucide-react';
import {MenuButtonsPrimaryBar, MenuButtonsSideBar} from './menuButtons.jsx';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from '../context/themeContext.jsx';
import MainRequests from "../services/requests.js";

const requests = new MainRequests();

const PREFERRED_ORDER = ['dashboard', 'revenues', 'expenses', 'register', 'reports', 'settings'];

// grupos exibidos na sidebar (a ordem dentro do grupo segue PREFERRED_ORDER)
const GROUPS = [
    { label: 'Módulos', pages: ['dashboard', 'revenues', 'expenses', 'register', 'reports'] },
    { label: 'Sistema', pages: ['settings'] },
];

export const presetPages = {
    dashboard: { path: "/dashboard", icon: <ChartColumn size={14}/>,     title: "Dashboard" },
    revenues:  { path: "/revenues",  icon: <BadgeDollarSign size={14}/>, title: "Receitas" },
    expenses:  { path: "/expenses",  icon: <Receipt size={14}/>,         title: "Despesas" },
    register:  { path: "/register",  icon: <Users size={14}/>,           title: "Registros" },
    reports:   { path: "/reports",   icon: <FileText size={14}/>,        title: "Relatórios" },
    settings:  { path: "/settings",  icon: <Settings size={14}/>,        title: "Configurações" },
};

function Sidebar({ orgName = 'ADEB' }) {
    const navigate = useNavigate();
    const [pagesPermissions, setPagesPermissions] = useState([]);
    const { isDark, toggleTheme } = useTheme();

    useEffect(() => {
        async function getPermission() {
            const response = await requests.onGet("permissions");
            const sorted = [...response].sort((a, b) => {
                const posA = PREFERRED_ORDER.indexOf(a.page_name);
                const posB = PREFERRED_ORDER.indexOf(b.page_name);
                return (posA !== -1 ? posA : 999) - (posB !== -1 ? posB : 999);
            });
            setPagesPermissions(sorted);
        }
        getPermission().then();
    }, []);


    // TODO: ligue aqui o seu logout atual
    const handleLogout = () => navigate('/login');

    const canView = (pageName) =>
        pagesPermissions.some((p) => p.page_name === pageName && p.can_view === true) &&
        presetPages[pageName] !== undefined;

    return (
        <aside className="hidden md:flex w-70 shrink-0 flex-col h-full bg-bg-primary-color border-r border-bg-secondary-destack-color">
            {/* logo */}
            <div className="flex items-center gap-3 px-5 py-5 border-b border-bg-secondary-destack-color mx-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-bg-secondary-destack-color text-primary-titles-color">
                    <Church size={18}/>
                </div>
                <div className="flex flex-col leading-tight">
                    <span className="text-sm font-semibold text-primary-titles-color">Sistema Financeiro</span>
                    <span className="text-xs tracking-widest">{orgName}</span>
                </div>
            </div>

            {/* navegação */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-5">
                {GROUPS.map((group) => {
                    const visible = group.pages.filter(canView);
                    if (visible.length === 0) return null;
                    return (
                        <div key={group.label} className="flex flex-col gap-1">
                            <span className="px-3 pb-1 text-xs opacity-60">{group.label}</span>
                            <ul className="flex flex-col gap-1">
                                {visible.map((pageName) => (
                                    <li key={pageName}>
                                        <MenuButtonsPrimaryBar
                                            to={presetPages[pageName].path}
                                            onClick={() => navigate(presetPages[pageName].path)}
                                        >
                                            {presetPages[pageName].icon} {presetPages[pageName].title}
                                        </MenuButtonsPrimaryBar>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </nav>

            {/* rodapé */}
            <div className="px-3 py-3 border-t border-bg-secondary-destack-color mx-3 flex flex-col gap-1">
                <button
                onClick={toggleTheme}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-bg-secondary-destack-color text-primary-titles-color"
            >
                {isDark ? <Sun size={14}/> : <Moon size={14}/>}
                {isDark ? 'Modo Claro' : 'Modo Escuro'}
            </button>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-red-700/20 hover:text-red-500 text-primary-titles-color"
                >
                    <LogOut size={14}/> Sair
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
