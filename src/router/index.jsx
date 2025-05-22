import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Template from "../layouts/Template";
import Dashboard from "../pages/Dashboard";
import Member from "../pages/member/Index";
import Peminjaman from "../pages/peminjaman/Index";
import Buku from "../pages/buku";
import DataPeminjaman from "../pages/peminjaman/Data";
import DendaIndex from "../pages/denda/Index";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Template />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "member",
        element: <Member />,
      },
      {
        path: "buku",
        element: <Buku />,
      },
      {
        path: "peminjaman",
        element: <Peminjaman />,
      },
      {
        path: "peminjaman/data",
        element: <DataPeminjaman />,
      },
      {
        path: "denda",
        element: <DendaIndex />,
      },
    ],
  },
]);
