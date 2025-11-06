import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import logoL from "../../assets/images/logo-L.png";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    nuevaContrasenia: "",
    confirmarContrasenia: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { changePassword, logout } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (error) {
      setError(null);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nuevaContrasenia.trim()) {
      newErrors.nuevaContrasenia = "La nueva contraseña es requerida";
    } else if (formData.nuevaContrasenia.length < 6) {
      newErrors.nuevaContrasenia =
        "La contraseña debe tener al menos 6 caracteres";
    }

    if (!formData.confirmarContrasenia.trim()) {
      newErrors.confirmarContrasenia = "Debe confirmar la contraseña";
    } else if (formData.nuevaContrasenia !== formData.confirmarContrasenia) {
      newErrors.confirmarContrasenia = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReturn = async () => {
    // Logout and return to login
    await logout();
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await changePassword(formData.nuevaContrasenia);

      // Navigate to dashboard (primeraSesion is updated by the context)
      navigate("/dashboard", {
        state: {
          message: "Contraseña actualizada exitosamente.",
        },
      });
    } catch (err) {
      setError(err.message || "Error al cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-blue-100 dark:bg-[#110022]">
      <div className="card w-full max-w-md border-2 border-neutral-400">
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="max-w-40 max-h-40 mx-auto flex items-center justify-center">
              <img
                src={logoL}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
            Cambio de Contraseña Recomendado
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300">
            Por seguridad, le recomendamos cambiar su contraseña
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Nueva Contraseña"
            name="nuevaContrasenia"
            type="password"
            value={formData.nuevaContrasenia}
            onChange={handleChange}
            error={errors.nuevaContrasenia}
            placeholder="Ingrese su nueva contraseña"
            autoComplete="new-password"
          />

          <Input
            label="Confirmar Contraseña"
            name="confirmarContrasenia"
            type="password"
            value={formData.confirmarContrasenia}
            onChange={handleChange}
            error={errors.confirmarContrasenia}
            placeholder="Confirme su nueva contraseña"
            autoComplete="new-password"
          />

          {error && (
            <div className="bg-yellow-100 border-2 border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 flex-shrink-0 text-yellow-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              Cambiar Contraseña
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={handleReturn}
              disabled={loading}
            >
              Retornar
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © 2025 Universidad Nacional de San Antonio Abad del Cusco
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
