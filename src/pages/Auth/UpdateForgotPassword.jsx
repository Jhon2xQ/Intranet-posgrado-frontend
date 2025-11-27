import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { authService } from "../../services/auth";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import logoL from "../../assets/images/logo-L.png";

const UpdateForgotPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [formData, setFormData] = useState({
        nuevaContrasenia: "",
        confirmarContrasenia: "",
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            setServerError("Token no proporcionado. Por favor verifique su enlace.");
        }
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear all errors when user starts typing in any field
        setErrors({});
        if (serverError) setServerError(null);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nuevaContrasenia) {
            newErrors.nuevaContrasenia = "La nueva contraseña es requerida";
        }

        if (formData.nuevaContrasenia !== formData.confirmarContrasenia) {
            newErrors.confirmarContrasenia = "Las contraseñas no coinciden";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            setServerError("Token inválido o faltante");
            return;
        }

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setServerError(null);
        setSuccessMessage(null);

        try {
            const response = await authService.updateForgotPassword(
                token,
                formData.nuevaContrasenia
            );

            if (response.success) {
                setSuccessMessage(response.message);
                // Optional: Redirect to login after a delay
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            } else {
                setServerError(response.message);
            }
        } catch (err) {
            setServerError(err.message || "Error al actualizar la contraseña");
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
                        Actualizar Contraseña
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-300">
                        Ingrese su nueva contraseña
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Nueva Contraseña"
                        name="nuevaContrasenia"
                        type="password"
                        value={formData.nuevaContrasenia}
                        onChange={handleChange}
                        placeholder="Ingrese nueva contraseña"
                    />

                    <Input
                        label="Confirmar Contraseña"
                        name="confirmarContrasenia"
                        type="password"
                        value={formData.confirmarContrasenia}
                        onChange={handleChange}
                        placeholder="Confirme nueva contraseña"
                    />

                    {successMessage && (
                        <div className="bg-green-100 border-2 border-green-400 text-green-800 px-4 py-3 rounded-lg mb-4">
                            <div className="flex items-center">
                                <svg
                                    className="w-5 h-5 mr-2 flex-shrink-0 text-green-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <p className="text-sm">{successMessage}</p>
                            </div>
                        </div>
                    )}

                    {(serverError || Object.keys(errors).length > 0) && !successMessage && (
                        <div className="bg-red-100 border-2 border-red-400 text-red-800 px-4 py-3 rounded-lg mb-4">
                            <div className="flex items-center">
                                <svg
                                    className="w-5 h-5 mr-2 flex-shrink-0 text-red-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <div className="text-sm">
                                    {serverError && <p>{serverError}</p>}
                                    {errors.nuevaContrasenia && <p>{errors.nuevaContrasenia}</p>}
                                    {errors.confirmarContrasenia && <p>{errors.confirmarContrasenia}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        loading={loading}
                        disabled={loading || !token}
                    >
                        Actualizar Contraseña
                    </Button>

                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <Link
                            to="/login"
                            className="flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-all duration-200 group"
                        >
                            <svg
                                className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-200"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                            Regresar al Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateForgotPassword;
