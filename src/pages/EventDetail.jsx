import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const urlBase = import.meta.env.VITE_API_URL;

  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getEvent = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${urlBase}/events/${eventId}`);
      setEvent(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getEvent();
  }, [eventId]);

  if (isLoading) return <div>Cargando...</div>;
  if (!event) return <div>Evento no encontrado</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <p>📍 {event.venue}</p>
      <p>📅 {new Date(event.starts_at).toLocaleString()}</p>

      <h3>Precio: ${event.price}</h3>

      <button onClick={() => navigate(`/checkout/${event.id}`)}>
        Comprar Entradas
      </button>
    </div>
  );
};

export default EventDetail;
