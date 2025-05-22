import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Template() {
    return (
        <>
            <Navbar></Navbar>
            <div className="container">
                <Outlet />
            </div>
        </>
    )
}