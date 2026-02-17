import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../componentes/layout/Header";
import "./MainLayout.css";
import Footer from "../componentes/layout/Footer";

const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="appMain">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
