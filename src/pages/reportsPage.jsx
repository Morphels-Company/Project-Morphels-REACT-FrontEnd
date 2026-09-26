import Menu from "../components/menu.jsx"
import Header from "../components/header.jsx";
import {BadgeDollarSign, Search, Trash2} from "lucide-react";
import Header2 from "../components/header2.jsx";
import SearchBar from "../components/searchBar.jsx";
import {useEffect, useState} from "react";
import OpenFromButton from "../components/openFromButton.jsx";
import SearchArea from "../components/searchArea.jsx";
import ModalReports from "../components/modalReports.jsx";
import MainRequests from "../services/requests.js";
import {ArrowDownToLine} from "lucide-react";
import {useNavigate, useNavigation} from "react-router-dom";
import {MenuProvider} from "../context/menuContext.jsx";
import SideMenu from "../components/sideMenu.jsx";

const request = new MainRequests()
function ReportsPage() {
    const [reports, setReports] = useState([])
    const [search, setSearch] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [branches, setBranches] = useState([])
    const navigate = useNavigate();

    async function onfetch(){
        const response_reports = await request.onGet("reports", search)
        const response_branches = await request.onGet("branches", search)

        setReports(response_reports);
        setBranches(response_branches ? response_branches : []);
    }

    useEffect(() => {
        onfetch().then()
    },[])

    async function onDeleteReports(id) {
        await request.onDelete("reports",id)
        onfetch().then()
    }

  return (
      <div className='justify-center h-[90vh] w-screen'>
          <MenuProvider>
              <Header/>
              <SideMenu/>
          </MenuProvider>
          <Menu/>

          <div className="flex justify-center">
              <div className="flex flex-col justify-center mt-8 p-4 bg-bg-secondary-color border border-bg-secondary-destack-color rounded-lg shadow-md gap-5 w-[80vw] md:w-[55vw]">
                  <section className="flex justify-between items-center">
                      <Header2
                          title={"Formulário de relatórios"}
                          description={"Formulário de cadastro de relatórios"}
                      />
                      <div className="flex justify-center">
                          <OpenFromButton onClick={() => setShowModal(true)} >
                              {"New Report"}
                          </OpenFromButton>
                      </div>
                  </section>
                  <SearchArea placeholder={"Search by description or member..."} showFilter={() => setShowFilter(!showFilter)}
                              value={search}
                              onChange={(e) => {
                                  setSearch(e.target.value)
                              }}/>
                  <section className="w-full rounded-lg border border-bg-secondary-destack-color overflow-auto">
                      <table className="w-full min-w-200">
                          <thead className="">
                          <tr className="h-10 text-xs  text-left border border-bg-secondary-destack-color">
                              <th className="px-2">Title</th>
                              <th>Type</th>
                              <th>Period</th>
                              <th>Create in</th>
                              <th>By</th>
                              <th className="text-right px-2">Actions</th>
                          </tr>
                          </thead>
                          <tbody>
                          {reports.map((report) => {
                              const dates = [report.date, report.start_date, report.end_date];
                              let formatedDates = []
                              for( let date of dates ) {
                                  formatedDates.push(new Date(date).toLocaleDateString("pt-BR", {
                                      timeZone: "UTC",
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                  }))
                              }


                              return (
                                  <tr className="h-11 text-xs text-left border border-bg-secondary-destack-color hover:bg-bg-secondary-destack-color"
                                      key={report.id}>
                                      <td className="p-2">{report.title}</td>
                                      <td><div className="inline-block border border-neutral-200 px-1 rounded-md">{report.type}</div></td>
                                      <td>{formatedDates[1]} until {formatedDates[2]}</td>
                                      <td>{formatedDates[0]}</td>
                                      <td>{report.creator}</td>

                                      <td>
                                          <div className="pr-3 flex justify-end  items-center gap-2">
                                              <button onClick={() => {
                                                  navigate("/reports/local",{state:{report_id: report.id}})}}>
                                                  <ArrowDownToLine size={18}/>
                                              </button>

                                              <button onClick={() => onDeleteReports(report.id)} className="text-red-600 hover:bg-red-200 p-1 rounded-md">
                                                  <Trash2 size={18}/>
                                              </button>
                                          </div>
                                      </td>
                                  </tr>
                              );
                          })}

                          </tbody>
                      </table>
                  </section>
                  {showModal && (
                      <ModalReports
                          onFetch={() => onfetch()}
                          onHideForm={() => setShowModal(false)}
                          branches={branches}
                      />
                  )}
              </div>
          </div>
      </div>
  )}
export default ReportsPage;