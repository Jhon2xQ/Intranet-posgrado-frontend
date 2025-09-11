import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import logoL from "../../assets/images/logo-L.png";

const Login = () => {
  const [formData, setFormData] = useState({
    usuario: "",
    contrasenia: "",
  });
  const [errors, setErrors] = useState({});
  const { login, isAuthenticated, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when user starts typing
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear auth error when user starts typing
    if (error) {
      clearError();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.usuario.trim()) {
      newErrors.usuario = "El usuario es requerido";
    }

    if (!formData.contrasenia.trim()) {
      newErrors.contrasenia = "La contraseña es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
      // Navigation will happen automatically via useEffect when isAuthenticated becomes true
    } catch (err) {
      // Error is handled by the auth context and will be displayed
      console.error("Login error:", err);
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
            Intranet Estudiantes
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300">
            Escuela de Posgrado UNSAAC
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Usuario"
            name="usuario"
            value={formData.usuario}
            onChange={handleChange}
            error={errors.usuario}
            placeholder="Ingrese su usuario"
            autoComplete="username"
          />

          <Input
            label="Contraseña"
            name="contrasenia"
            type="password"
            value={formData.contrasenia}
            onChange={handleChange}
            error={errors.contrasenia}
            placeholder="Ingrese su contraseña"
            autoComplete="current-password"
          />

          {error && (
            <div className="bg-yellow-100 border-2 border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg mb-4">
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
                <div>
                  <p className="text-sm font-bold">Error de autenticación</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            Ingresar
          </Button>
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

export default Login;
