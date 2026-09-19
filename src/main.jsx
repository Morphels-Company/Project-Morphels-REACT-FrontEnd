import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import RevenuesPage from './pages/revenuesPage.jsx';
import ExpensesPage from './pages/expensesPage.jsx';
import Register from './pages/register.jsx';
import ReportsPage from './pages/reportsPage.jsx';
import LocalReportsPage from './pages/localReportsPage.jsx';
import DashBoard from './pages/dashBoard.jsx';
// import Teste from './components/scanner.jsx'
import InstitutionRegister from "./pages/institutionRegister.jsx";
import {createBrowserRouter, Outlet, RouterProvider} from 'react-router-dom';
import { WithoutPermissionProvider } from "./context/withoutPermissionContext.jsx";
import SettingsPage from "./pages/settingsPage.jsx";
import Teste from './pages/Teste.jsx'

const router = createBrowserRouter([
  {element:(
        <WithoutPermissionProvider>
          <Outlet/>
        </WithoutPermissionProvider>
    ),
    children: [
      {
        path: "/",
        element: <App />,
      },
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
        element: <LocalReportsPage />,
      },
      {
        path: "/teste",
        element: <Teste />,
      },
      {
        path: "/register/institution",
        element: <InstitutionRegister />,
      },
      {
        path: "/teste",
        element: <Teste />,
      },
    ]}


]);

createRoot(document.getElementById('root')).render(
  <StrictMode>

      <RouterProvider router={router} />

  </StrictMode>,
)
