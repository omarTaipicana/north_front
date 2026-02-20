import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EventList from "./pages/EventList";
import Checkout from "./pages/Checkout";
import UploadPayment from "./pages/UploadPayment";
import TicketStatus from "./pages/TicketStatus";

import StaffLogin from "./pages/StaffLogin";
import StaffScanner from "./pages/StaffScanner";
import StaffValidator from "./pages/StaffValidator";
import StaffAdmin from "./pages/StaffAdmin";
import EventDetail from "./pages/EventDetail";
import MainLayout from "./layout/MainLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import StaffLayout from "./layout/StaffLayout";
import StaffUnauthorized from "./pages/StaffUnauthorized";
import Contact from "./pages/Contact";
import Partners from "./pages/Partners";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/event/:eventId" element={<EventDetail />} />
        <Route path="/checkout/:eventId" element={<Checkout />} />
        <Route path="/payment/:orderId" element={<UploadPayment />} />
        <Route path="/ticket/:code" element={<TicketStatus />} />
        <Route path="/staff/login" element={<StaffLogin />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/partners" element={<Partners />} />



        {/* Staff */}
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<StaffLayout />}>
          {/* Admin puede todo, validator NO entra, scanner NO entra */}
          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route path="/staff/admin" element={<StaffAdmin />} />
          </Route>

          {/* Validator + Admin */}
          <Route element={<ProtectedRoute roles={["validator"]} />}>
            <Route path="/staff/validator" element={<StaffValidator />} />
          </Route>

          {/* Scanner + Admin */}
          <Route element={<ProtectedRoute roles={["scanner"]} />}>
            <Route path="/staff/scanner" element={<StaffScanner />} />
          </Route>

          {/* Página si no tiene permiso */}
          <Route path="/staff/unauthorized" element={<StaffUnauthorized />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
