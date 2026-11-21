import AppLayout from "../components/appLayout.jsx";
import {Users, Building2, IdCard, FileText} from "lucide-react";
import {useState} from "react";
import {MemberPage} from "../components/subpages/registerMerbersPage.jsx";
import {CompaniesPage} from "../components/subpages/registerCompaniesPages.jsx";
import {CardsPage} from "../components/subpages/registerCardsPage.jsx";

function Register() {
    const [activePage, setActivePage] = useState(1);
    const [permissions, setPermissions] = useState([1,2,3]);

    const pages = [
        { id: 1, name: "Membros", permission: 1, component: <MemberPage />, icon: <Users  size={14}/> },
        { id: 2, name: "Companias", permission: 2, component: <CompaniesPage />, icon: <Building2  size={14}/> },
        { id: 3, name: "Cartões", permission: 3, component: <CardsPage />, icon: <IdCard size={14}/> },
    ];

    const currentPage = pages.find(p => p.permission === activePage && permissions.includes(p.permission));

    return (
        <AppLayout
            title="Register"
            icon={<Users size={16}/>}
            orgName="ADEB"
        >

            <section className="flex justify-center items-center mt-7">
                <ul className="flex flex-row bg-bg-secondary-color rounded-sm items-center shadow-lg w-[80vw] md:w-[55vw]">
                    {pages.map(item => (
                            <li key={item.id} className="w-full">
                                <button
                                    onClick={() => setActivePage(item.permission)}
                                    className={`w-full flex gap-3 text-sm justify-center items-center py-1 hover:bg-bg-secondary-destack-color ${
                                        activePage === item.permission ? "bg-bg-secondary-destack-color" : "bg-transparent"
                                    } rounded-sm`}
                                >
                                    {item.icon}
                                    {item.name}
                                </button>
                            </li>
                        ))}
                </ul>
            </section>

            {currentPage ? currentPage.component : <div>Sem permissão</div>}
        </AppLayout>
    );
}


export default Register;