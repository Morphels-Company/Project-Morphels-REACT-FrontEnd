import { Menu as MenuIcon, Moon, Sun } from 'lucide-react';
import { MenuProvider, useMenu } from "../context/menuContext.jsx";
import SideMenu from "./sideMenu.jsx";   // drawer do mobile (já existente)
import Sidebar from "./sidebar.jsx";     // sidebar do desktop
import { ThemeProvider, useTheme } from '../context/themeContext.jsx';

function LayoutContent({ title, icon, orgName, headerRight, children }) {
    const { toggleMenu } = useMenu();
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className="flex h-screen w-screen overflow-hidden">
            <Sidebar orgName={orgName}/>
            <SideMenu/>

            <div className="flex flex-col flex-1 min-w-0">
                {/* barra superior */}
                <header className="flex items-center justify-between h-14 shrink-0 px-4 md:px-6 bg-bg-primary-color border-b border-bg-secondary-destack-color">
                    <div className="flex items-center gap-3 text-primary-titles-color">
                        <button
                            onClick={toggleMenu}
                            className="md:hidden p-1 rounded-lg hover:bg-bg-secondary-destack-color"
                            aria-label="Abrir menu"
                        >
                            <MenuIcon size={20}/>
                        </button>
                        <span className="flex items-center gap-2 text-sm font-medium">
                            {icon} {title}
                        </span>
                        <span className="hidden sm:inline text-xs opacity-60">{orgName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {headerRight}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-bg-secondary-destack-color text-primary-titles-color"
                            aria-label="Alternar tema"
                        >
                            {isDark ? <Sun size={16}/> : <Moon size={16}/>}
                        </button>
                    </div>
                </header>

                {/* conteúdo */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="mx-auto w-full max-w-6xl flex flex-col gap-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

// use <AppLayout> em todas as páginas
function AppLayout(props) {
    return (
        <ThemeProvider>
            <MenuProvider>
                <LayoutContent {...props}/>
            </MenuProvider>
        </ThemeProvider>
    );
}

export default AppLayout;
