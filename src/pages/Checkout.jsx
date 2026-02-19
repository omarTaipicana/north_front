import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useOrders from "../hooks/useOrders";
import "./styles/Checkout.css";

const Checkout = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [createOrder, isLoading] = useOrders();

  const urlBase = import.meta.env.VITE_API_URL;

  const [eventPrice, setEventPrice] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // ✅ traer precio del evento
  useEffect(() => {
    let mounted = true;

    const loadEvent = async () => {
      try {
        const res = await axios.get(`${urlBase}/events/${eventId}`);
        const price = Number(res?.data?.price || 0);
        if (mounted) setEventPrice(price);
      } catch (e) {
        // si falla, se queda 0 y no rompe nada
        if (mounted) setEventPrice(0);
      }
    };

    if (eventId) loadEvent();

    return () => {
      mounted = false;
    };
  }, [eventId, urlBase]);

  const onSubmit = async (data) => {
    try {
      // ✅ calcular total y guardar para prellenar en UploadPayment
      const qty = Number(data.quantity || 1);
      const unitPrice = Number(eventPrice || 0);
      const total = (qty * unitPrice).toFixed(2);

      localStorage.setItem("north_prefill_amount", total);

      const order = await createOrder({
        ...data,
        eventId,
      });

      navigate(`/payment/${order.id}`);
    } catch (error) {
      alert("Error creando la orden");
    }
  };

  return (
    <div className="checkout">
      <div className="checkout__container">
        <div className="checkout__head">
          <h2 className="checkout__title">Crear Orden</h2>
          <p className="checkout__subtitle">
            Completa tus datos para continuar al pago
          </p>
        </div>

        <form className="checkout__form" onSubmit={handleSubmit(onSubmit)}>
          {/* Nombre */}
          <div className="checkout__field">
            <label className="checkout__label">Nombre completo</label>
            <input
              className={`checkout__input ${
                errors.buyer_name ? "checkout__input--error" : ""
              }`}
              placeholder="Nombre completo"
              {...register("buyer_name", { required: true })}
            />
            {errors.buyer_name && (
              <p className="checkout__error">Nombre requerido</p>
            )}
          </div>

          {/* Email */}
          <div className="checkout__field">
            <label className="checkout__label">Correo</label>
            <input
              type="email"
              className={`checkout__input ${
                errors.buyer_email ? "checkout__input--error" : ""
              }`}
              placeholder="Correo"
              {...register("buyer_email", { required: true })}
            />
            {errors.buyer_email && (
              <p className="checkout__error">Email requerido</p>
            )}
          </div>

          {/* Teléfono */}
          <div className="checkout__field">
            <label className="checkout__label">Teléfono</label>
            <input
              className={`checkout__input ${
                errors.buyer_phone ? "checkout__input--error" : ""
              }`}
              placeholder="Teléfono"
              {...register("buyer_phone", { required: true })}
            />
            {errors.buyer_phone && (
              <p className="checkout__error">Teléfono requerido</p>
            )}
          </div>

          {/* Cantidad */}
          <div className="checkout__field">
            <label className="checkout__label">Cantidad de entradas</label>

            <select
              className={`checkout__input checkout__input--qty ${
                errors.quantity ? "checkout__input--error" : ""
              }`}
              defaultValue={1}
              {...register("quantity", { required: true })}
            >
              {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>

            {errors.quantity && (
              <p className="checkout__error">Cantidad requerida</p>
            )}
          </div>

          <button className="checkout__btn" type="submit" disabled={isLoading}>
            {isLoading ? "Procesando..." : "Continuar al Pago"}
          </button>

          <div className="checkout__note">
            Tus entradas serán enviadas por correo una vez validado tu pago.
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
