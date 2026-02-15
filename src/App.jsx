import { Route, Routes, useLocation } from "react-router-dom";

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

function App() {

  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      {/* Público */}
      <Route path="/" element={<Home />} />
      <Route path="/events" element={<EventList />} />
      <Route path="/event/:eventId" element={<EventDetail />} />
      <Route path="/checkout/:eventId" element={<Checkout />} />
      <Route path="/payment/:orderId" element={<UploadPayment />} />
      <Route path="/ticket/:code" element={<TicketStatus />} />

      {/* Staff */}
      <Route path="/staff/login" element={<StaffLogin />} />
      <Route path="/staff/scanner" element={<StaffScanner />} />
      <Route path="/staff/validator" element={<StaffValidator />} />
      <Route path="/staff/admin" element={<StaffAdmin />} />

      {/* 404 simple */}
      <Route path="*" element={<div style={{ padding: 20 }}>404</div>} />
    </Routes>
  )
}

export default App
