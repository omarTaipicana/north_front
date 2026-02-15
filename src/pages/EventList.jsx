import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useEvents from "../hooks/useEvents";

const EventList = () => {
    const navigate = useNavigate();
    const [getEvents, events, isLoading] = useEvents();

    useEffect(() => {
        getEvents();
    }, []);

    if (isLoading) return <div>Cargando eventos...</div>;

    return (
        <div style={{ padding: 20 }}>
            <h2>Eventos</h2>

            {events.map((event) => (
                <div
                    key={event.id}
                    style={{
                        border: "1px solid #ccc",
                        padding: "15px",
                        marginBottom: "10px",
                        cursor: "pointer",
                    }}
                    onClick={() => navigate(`/event/${event.id}`)}
                >
                    <h3>{event.title}</h3>
                    <p>{event.venue}</p>
                    <p>{event.starts_at}</p>
                </div>
            ))}
        </div>
    );
};

export default EventList;
