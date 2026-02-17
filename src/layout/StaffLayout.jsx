import { Outlet } from "react-router-dom";
import StaffHeader from "../componentes/staff/StaffHeader";
import "./StaffLayout.css";

const StaffLayout = () => {
  return (
    <div className="staffLayout">
      <StaffHeader />
      <main className="staffLayout__main">
        <Outlet />
      </main>
    </div>
  );
};

export default StaffLayout;
