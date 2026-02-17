import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useTicketStatus from "../hooks/useTicketStatus";

const TicketStatus = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  const [getStatus, ticket, isLoading] = useTicketStatus();

  useEffect(() => {
    // Si staff está logueado => redirigir al scanner con code
    const token = localStorage.getItem("token");
    const staff = localStorage.getItem("staff");

    if (token && staff) {
      navigate(`/staff/scanner?code=${encodeURIComponent(code)}`, { replace: true });
      return;
    }

    // Si no hay staff => consulta estado
    getStatus(code).catch(() => {});
  }, [code]);

  if (isLoading) return <div style={{ padding: 20 }}>Cargando...</div>;

  if (!ticket) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Ticket</h2>
        <p>No se pudo verificar el ticket.</p>
        <p>Si crees que es un error, contacta a soporte.</p>
      </div>
    );
  }

  const status = ticket.status; // active | used | cancelled

  return (
    <div style={{ padding: 20 }}>
      <h2>Estado de tu Entrada</h2>

      <div
        style={{
          marginTop: 12,
          padding: 16,
          borderRadius: 10,
          border: "1px solid #ddd",
          background:
            status === "active"
              ? "#e9ffe9"
              : status === "used"
              ? "#fff3cd"
              : "#ffd9d9",
        }}
      >
        {status === "active" && (
          <>
            <h3>✅ Entrada válida</h3>
            <p>Presenta este QR en el ingreso.</p>
          </>
        )}

        {status === "used" && (
          <>
            <h3>⚠️ Entrada ya utilizada</h3>
            {ticket.used_at && (
              <p>
                <b>Usada:</b>{" "}
                {new Date(ticket.used_at).toLocaleString("es-EC", {
                  timeZone: "America/Guayaquil",
                })}
              </p>
            )}
            {ticket.gate && (
              <p>
                <b>Puerta:</b> {ticket.gate}
              </p>
            )}
          </>
        )}

        {status === "cancelled" && (
          <>
            <h3>❌ Entrada cancelada</h3>
            <p>Contacta a soporte si necesitas ayuda.</p>
          </>
        )}

        <p style={{ marginTop: 10, fontSize: 13, opacity: 0.8 }}>
          Código: {code}
        </p>
      </div>
    </div>
  );
};

export default TicketStatus;
