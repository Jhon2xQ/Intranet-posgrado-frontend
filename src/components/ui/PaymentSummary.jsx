import React from "react";

const PaymentSummary = ({ paymentData }) => {
  if (!paymentData) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-4">
          Resumen de Pagos
        </h3>
        <p className="text-neutral-600 dark:text-white/80">
          No hay datos de pagos disponibles.
        </p>
      </div>
    );
  }

  const { totalPrograma, totalPagado, totalPendiente } = paymentData;
  const progressPercentage =
    totalPrograma > 0 ? (totalPagado / totalPrograma) * 100 : 0;
  const hasDebt = totalPendiente > 0;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-6">
        Resumen Financiero
      </h3>

      <div className="space-y-6">
        {/* Financial Overview */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-blue-100 dark:bg-blue-500/20 rounded-lg p-4 text-center">
            <h4 className="text-sm font-medium text-blue-700 dark:text-blue-200 mb-1">
              Costo Total del Programa
            </h4>
            <p className="text-2xl font-bold text-neutral-800 dark:text-white">
              S/{" "}
              {totalPrograma.toLocaleString("es-PE", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="bg-green-100 dark:bg-green-500/20 rounded-lg p-4 text-center">
            <h4 className="text-sm font-medium text-green-700 dark:text-green-200 mb-1">
              Total Pagado
            </h4>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              S/{" "}
              {totalPagado.toLocaleString("es-PE", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>

          <div
            className={`rounded-lg p-4 text-center ${
              hasDebt
                ? "bg-red-100 dark:bg-red-500/20"
                : "bg-green-100 dark:bg-green-500/20"
            }`}
          >
            <h4
              className={`text-sm font-medium mb-1 ${
                hasDebt
                  ? "text-red-700 dark:text-red-200"
                  : "text-green-700 dark:text-green-200"
              }`}
            >
              {hasDebt ? "Deuda Pendiente" : "Estado"}
            </h4>
            <p
              className={`text-2xl font-bold ${
                hasDebt
                  ? "text-red-600 dark:text-red-400"
                  : "text-green-600 dark:text-green-400"
              }`}
            >
              {hasDebt
                ? `S/ ${totalPendiente.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`
                : "Al día"}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-neutral-800 dark:text-white font-medium">
              Progreso de Pagos
            </span>
            <span className="text-neutral-600 dark:text-white/80">
              {progressPercentage.toFixed(1)}%
            </span>
          </div>

          <div className="w-full bg-neutral-300 dark:bg-white/20 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Status Indicator */}
        <div
          className={`p-4 rounded-lg border-l-4 ${
            hasDebt
              ? "bg-red-100 dark:bg-red-500/10 border-red-500"
              : "bg-green-100 dark:bg-green-500/10 border-green-500"
          }`}
        >
          <div className="flex items-center">
            {hasDebt ? (
              <div className="w-3 h-3 rounded-full mr-3 bg-red-500" />
            ) : (
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-success-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
            <div className="ml-3">
              <p
                className={`text-sm font-medium ${
                  hasDebt
                    ? "text-red-700 dark:text-red-200"
                    : "text-green-700 dark:text-green-200"
                }`}
              >
                {hasDebt
                  ? `Tienes una deuda pendiente de S/ ${totalPendiente.toLocaleString(
                      "es-PE",
                      {
                        minimumFractionDigits: 2,
                      },
                    )}`
                  : "¡Felicitaciones! Estás al día con tus pagos"}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-300 dark:border-white/20">
          <div className="text-center">
            <p className="text-2xl font-bold text-neutral-800 dark:text-white">
              {progressPercentage.toFixed(0)}%
            </p>
            <p className="text-sm text-neutral-600 dark:text-white/70">
              Completado
            </p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-neutral-800 dark:text-white">
              {(100 - progressPercentage).toFixed(0)}%
            </p>
            <p className="text-sm text-neutral-600 dark:text-white/70">
              Restante
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
