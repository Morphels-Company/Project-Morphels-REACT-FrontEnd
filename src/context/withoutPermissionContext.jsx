import { useState, useContext, createContext } from "react";
import {registerOpenModal} from "./withoutPermissionModalHandler.js";
import { useNavigate, useLocation } from 'react-router-dom';
import {WithoutPermissionContext} from "./withoutPermissionModalHandler.js";

export function WithoutPermissionProvider({ children }) {
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");
    const [path, setPath] = useState("");
    const navigate = useNavigate()
    const location = useLocation()


    const openModal = (msg= "you don't have permission to execute this action", status_code, path) => {
        setShowModal(true);
        setMessage(msg);
        setStatus(status_code)
        setPath(path)
        console.log(path)
    }
    registerOpenModal(openModal);

    const closeModal = () => {
        setShowModal(false);
    }

    return(
        <WithoutPermissionContext.Provider value={{ showModal, message, openModal, closeModal }}>
            {children}
            {showModal && (
                <div className="fixed inset-0 bg-[rgb(0,0,0,0.7)] bg-opacity-50 flex items-center justify-center">
                    <div className="flex flex-col items-center bg-white w-[80%] lg:w-[30%] p-6 rounded-lg shadow-lg space-y-4">
                        <h1 className="text-xl text-red-600">{status}</h1>
                        <p className="text-sm text-gray-500">{message}</p>
                        <button onClick={() => {
                            setShowModal(false)
                            console.log(path)
                            if (path === ".") {
                                const rotaAtual = location.pathname + location.search;
                                navigate(rotaAtual);
                            } else {
                                navigate("/");
                            }}} className="flex w-15 justify-center items-center bg-neutral-950 text-white text-sm px-2 py-1.5 gap-3 rounded hover:bg-neutral-600 transition-discrete">Close</button>
                    </div>
                </div>
            )}
        </WithoutPermissionContext.Provider>
    )
}
