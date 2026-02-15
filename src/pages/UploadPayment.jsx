import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import usePayments from "../hooks/usePayments";

const UploadPayment = () => {
  const { orderId } = useParams();
  const [createPayment, isLoading] = usePayments();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("orderId", orderId);
      formData.append("amount", data.amount);
      formData.append("currency", "USD");
      formData.append("file", data.proof[0]); // 👈 importante

      await createPayment(formData);

      alert("Comprobante enviado correctamente");
    } catch (error) {
      alert("Error subiendo comprobante");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Subir Comprobante</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="number"
          placeholder="Monto depositado"
          {...register("amount", { required: true })}
        />
        {errors.amount && <p>Monto requerido</p>}

        <br /><br />

        <input
          type="file"
          accept="image/*,.pdf"
          {...register("proof", { required: true })}
        />
        {errors.proof && <p>Debe subir comprobante</p>}

        <br /><br />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Enviando..." : "Enviar Comprobante"}
        </button>
      </form>
    </div>
  );
};

export default UploadPayment;
