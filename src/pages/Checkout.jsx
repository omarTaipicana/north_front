import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import useOrders from "../hooks/useOrders";

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
    <div style={{ padding: 20 }}>
      <h2>Crear Orden</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="Nombre completo"
          {...register("buyer_name", { required: true })}
        />
        {errors.buyer_name && <p>Nombre requerido</p>}

        <br /><br />

        <input
          type="email"
          placeholder="Correo"
          {...register("buyer_email", { required: true })}
        />
        {errors.buyer_email && <p>Email requerido</p>}

        <br /><br />

        <input
          placeholder="Teléfono"
          {...register("buyer_phone", { required: true })}
        />
        {errors.buyer_phone && <p>Teléfono requerido</p>}

        <br /><br />

        <input
          type="number"
          min="1"
          defaultValue={1}
          {...register("quantity", { required: true })}
        />

        <br /><br />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Procesando..." : "Continuar al Pago"}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
