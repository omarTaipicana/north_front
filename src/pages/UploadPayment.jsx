import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import usePayments from "../hooks/usePayments";
import "./styles/UploadPayment.css";

const UploadPayment = () => {
  const { orderId } = useParams();
  const [createPayment, isLoading] = usePayments();
  const navigate = useNavigate();

  const [modal, setModal] = useState({
    open: false,
    status: "success", // "success" | "error"
    title: "",
    message: "",
  });

  const [countdown, setCountdown] = useState(3);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: "",
    },
  });

  useEffect(() => {
    const prefill = localStorage.getItem("north_prefill_amount");
    if (prefill) {
      setValue("amount", prefill); // ✅ prellena monto
    }
  }, [setValue]);



  const file = watch("proof")?.[0];

  const isModalSuccess = modal.open && modal.status === "success";

  const closeModal = () => {
    setModal((p) => ({ ...p, open: false }));
    setCountdown(3);
  };

  const goHome = () => {
    closeModal();
    navigate("/", { replace: true });
  };

  // ✅ countdown + redirect
  useEffect(() => {
    if (!isModalSuccess) return;

    setCountdown(3);

    const tick = setInterval(() => {
      setCountdown((c) => c - 1);
    }, 1000);

    return () => clearInterval(tick);
  }, [isModalSuccess]);

  useEffect(() => {
    if (!isModalSuccess) return;
    if (countdown <= 0) goHome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown, isModalSuccess]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("orderId", orderId);
      formData.append("amount", data.amount);
      formData.append("currency", "USD");
      formData.append("file", data.proof[0]); // 👈 importante

      await createPayment(formData);
      localStorage.removeItem("north_prefill_amount");


      // ✅ modal success
      setModal({
        open: true,
        status: "success",
        title: "¡Comprobante enviado!",
        message:
          "Gracias. Nuestro equipo validará tu pago y recibirás tus tickets por correo.",
      });
    } catch (error) {
      setModal({
        open: true,
        status: "error",
        title: "No se pudo enviar",
        message:
          "Ocurrió un error subiendo el comprobante. Intenta nuevamente en unos segundos.",
      });
    }
  };

  // accesibilidad: cerrar con ESC
  useEffect(() => {
    if (!modal.open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modal.open]);

  return (
    <div className="uploadPay">
      <div className="uploadPay__container">
        <div className="uploadPay__head">
          <h2 className="uploadPay__title">Subir Comprobante</h2>
          <p className="uploadPay__subtitle">
            Orden: <span className="uploadPay__orderId">{orderId}</span>
          </p>
        </div>

        <div className="uploadPay__bankBox">
          <div className="uploadPay__bankTitle">Datos para transferencia</div>

          <div className="uploadPay__bankGrid">
            <div className="uploadPay__bankItem">
              <div className="uploadPay__bankLabel">Banco</div>
              <div className="uploadPay__bankValue">Banco Pichincha</div>
            </div>

            <div className="uploadPay__bankItem">
              <div className="uploadPay__bankLabel">Tipo de cuenta</div>
              <div className="uploadPay__bankValue">
                Cuenta de ahorro transaccional
              </div>
            </div>

            <div className="uploadPay__bankItem">
              <div className="uploadPay__bankLabel">Número</div>
              <div className="uploadPay__bankValue uploadPay__bankValue--mono">
                2211297105
              </div>
            </div>

            <div className="uploadPay__bankItem">
              <div className="uploadPay__bankLabel">Titular</div>
              <div className="uploadPay__bankValue">Geovanny Delgado</div>
            </div>
          </div>

          <div className="uploadPay__bankNote">
            Sube el comprobante (foto o PDF). Validaremos tu pago y te
            enviaremos tus tickets por correo.
          </div>
        </div>

        <form className="uploadPay__form" onSubmit={handleSubmit(onSubmit)}>
          {/* Monto */}
          <div className="uploadPay__field">
            <label className="uploadPay__label">Monto depositado</label>
            <input
              type="number"
              step="0.01"
              placeholder="Monto depositado"
              className={`uploadPay__input ${errors.amount ? "uploadPay__input--error" : ""}`}
              {...register("amount", { required: true })}
              disabled={isLoading}
            />

            {errors.amount && (
              <p className="uploadPay__error">Monto requerido</p>
            )}
          </div>

          {/* Archivo */}
          <div className="uploadPay__field">
            <label className="uploadPay__label">Comprobante</label>

            <label
              className={`uploadPay__drop ${errors.proof ? "uploadPay__drop--error" : ""
                }`}
            >
              <div className="uploadPay__dropTitle">
                {file
                  ? "Archivo seleccionado"
                  : "Arrastra tu archivo o haz click"}
              </div>

              <div className="uploadPay__dropHint">
                {file ? (
                  <span className="uploadPay__fileName">{file.name}</span>
                ) : (
                  "Formatos permitidos: imágenes o PDF"
                )}
              </div>

              <input
                type="file"
                accept="image/*,.pdf"
                className="uploadPay__fileInput"
                {...register("proof", { required: true })}
                disabled={isLoading}
              />
            </label>

            {errors.proof && (
              <p className="uploadPay__error">Debe subir comprobante</p>
            )}
          </div>

          <button className="uploadPay__btn" type="submit" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Enviar Comprobante"}
          </button>

          <div className="uploadPay__note">
            Nuestro equipo validará tu pago y recibirás tus tickets por correo.
          </div>
        </form>
      </div>

      {/* ✅ MODAL PRO */}
      {modal.open && (
        <div
          className="uploadPayModal__backdrop"
          onMouseDown={(e) => {
            // click fuera cierra (pero si es success y está redirigiendo, igual puede cerrar)
            if (e.target === e.currentTarget) closeModal();
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="uploadPayModal__card">
            <div
              className={`uploadPayModal__icon ${modal.status === "success"
                ? "uploadPayModal__icon--success"
                : "uploadPayModal__icon--error"
                }`}
            >
              {modal.status === "success" ? "✓" : "!"}
            </div>

            <h3 className="uploadPayModal__title">{modal.title}</h3>
            <p className="uploadPayModal__text">{modal.message}</p>

            {modal.status === "success" ? (
              <div className="uploadPayModal__count">
                Redirigiendo al inicio en <b>{countdown}</b>...
              </div>
            ) : null}

            <div className="uploadPayModal__actions">
              {modal.status === "success" ? (
                <>
                  <button
                    type="button"
                    className="uploadPayModal__btn uploadPayModal__btn--ghost"
                    onClick={closeModal}
                  >
                    Quedarme aquí
                  </button>
                  <button
                    type="button"
                    className="uploadPayModal__btn uploadPayModal__btn--primary"
                    onClick={goHome}
                  >
                    Ir al inicio
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="uploadPayModal__btn uploadPayModal__btn--ghost"
                    onClick={closeModal}
                  >
                    Cerrar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPayment;
