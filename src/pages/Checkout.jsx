import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import useOrders from "../hooks/useOrders";
import "./styles/Checkout.css";

const Checkout = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [createOrder, isLoading] = useOrders();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
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
            <input
              type="number"
              min="1"
              defaultValue={1}
              className={`checkout__input checkout__input--qty ${
                errors.quantity ? "checkout__input--error" : ""
              }`}
              {...register("quantity", { required: true })}
            />
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
