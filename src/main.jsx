import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import RevenuesPage from './pages/revenuesPage.jsx';
import ExpensesPage from './pages/expensesPage.jsx';
import Register from './pages/register.jsx';
import ReportsPage from './pages/reportsPage.jsx';
import ReportPreset from './pages/reportPreset.jsx';
import DashBoard from './pages/dashBoard.jsx';
import InstitutionRegister from "./pages/institutionRegister.jsx";
import {createBrowserRouter, Outlet, RouterProvider} from 'react-router-dom';
import { WithoutPermissionProvider } from "./context/withoutPermissionContext.jsx";
import {ValidateAuthentication} from "./services/validateAuthentication.js";
import SettingsPage from "./pages/settingsPage.jsx";
import Teste from './pages/Teste.jsx'
import ToastContainer from "./components/ToastContainer.jsx";
import ErrorFallback from "./components/ErrorFallback.jsx";
import SessionExpired from "./pages/SessionExpired.jsx";

const router = createBrowserRouter([
  // --- ROTAS PÚBLICAS ---
  {
    element: (
        <WithoutPermissionProvider>
          <Outlet />
        </WithoutPermissionProvider>
    ),
    children: [
      {
        path: "/",
        element: <App />,
        errorElement: <ErrorFallback />,
      },
      {
        path: "/register/institution",
        element: <InstitutionRegister />,
      },
      {
        path: "/sessao-expirada",
        element: <SessionExpired/>,
      }
    ],
  },

  // --- ROTAS PROTEGIDAS ---
  {
    loader: ValidateAuthentication,
    element: (

        <WithoutPermissionProvider>
          <Outlet />
        </WithoutPermissionProvider>
    ),
    children: [
      {
        path: "/dashboard",
        element: <DashBoard />,
      },
      {
        path: "/revenues",
        element: <RevenuesPage />,
      },
      {
        path: "/expenses",
        element: <ExpensesPage />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/reports",
        element: <ReportsPage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
      {
        path: "/reports/local",
        element: <ReportPreset />,
      },
      {
        path: "/teste",
        element: <Teste />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
      <RouterProvider router={router} />
      <ToastContainer />
    </StrictMode>,


);