import Header from "../components/header.jsx";
import Menu from "../components/menu.jsx";
import {User, Church, MapPinHouse, ListCheck} from "lucide-react";
import {useState, useEffect} from "react";
import MainRequests from "../services/requests.js";
import {Page1, Page2, Page3, Page4} from "../components/settingPages.jsx";
import {MenuProvider} from "../context/menuContext.jsx";
import SideMenu from "../components/sideMenu.jsx";

const requests = new MainRequests();

function SettingsPage() {
    const [activePage, setActivePage] = useState("");
    const [pagesPermissions, setPagesPermissions] = useState([]);

    const PREFERRED_ORDER = ['sectors', 'branches', 'users', 'designations'];

    const pages = {
        users: {
            title: "Usuários",
            component: <Page1 />,
            icon: <User size={14}/>
        },
        branches: {
            title: "Usuários",
            component: <Page2 />,
            icon: <Church size={14}/>
        },
        sectors: {
            title: "Setores",
            component: <Page3 />,
            icon: <MapPinHouse size={14}/>
        },
        permissions:{
            title: "Permissões",
            component: <Page4 />,
            icon: <ListCheck size={14}/>
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

            const firstAllowedPage = sortedPermissions.find(
                (page) => page.can_view && pages[page.page_name] !== undefined
            );


            if (firstAllowedPage) {
                setActivePage(firstAllowedPage.page_name);
            }

        }

        getPermission().then()
    }, [])
    const currentPage = pages[activePage]

    return (
        <div className="justify-center h-[90vh] w-screen">
            <MenuProvider>
                <Header/>
                <SideMenu/>
            </MenuProvider>
            <Menu/>

            <section className="flex justify-center items-center mt-7">
                <ul className="flex flex-row bg-bg-secondary-color rounded-sm items-center shadow-lg w-[80vw] md:w-[55vw]">
                    {
                        pagesPermissions.map((page) => {
                            if (page.can_view === true && pages[page.page_name] !== undefined) {
                               return (
                                   <li key={page.page_name} className="w-full">
                                       <button
                                           onClick={() => setActivePage(page.page_name)}
                                           className={`w-full flex gap-3 text-sm text-primary-titles-color justify-center items-center py-1 hover:bg-bg-secondary-destack-color ${
                                               activePage === page.page_name ? "bg-bg-secondary-destack-color" : "bg-transparent"} rounded-sm`}>
                                           {pages[page.page_name]?.icon}
                                           {pages[page.page_name]?.title}
                                       </button>
                                   </li>
                               )
                            }
                        })
                    }


                </ul>
            </section>

            {currentPage ? currentPage.component : <div>Sem permissão</div>}
        </div>
    );
}


export default SettingsPage;

