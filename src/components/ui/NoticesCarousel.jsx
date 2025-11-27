import React, { useState, useEffect } from "react";

const NoticesCarousel = ({ notices = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate notices every 5 seconds
  useEffect(() => {
    if (notices.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === notices.length - 1 ? 0 : prevIndex + 1,
      );
    }, 12000);

    return () => clearInterval(interval);
  }, [notices.length]);

  if (!notices.length) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Avisos Importantes
        </h3>
        <p className="text-gray-600 dark:text-white/80">
          No hay avisos disponibles en este momento.
        </p>
      </div>
    );
  }

  const currentNotice = notices[currentIndex];

  return (
    <div className="card relative overflow-hidden">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Avisos Importantes
      </h3>

      <div className="relative">
        {/* Notice Content */}
        <div
          key={currentIndex}
          className="animate-fade-in transition-all duration-500 ease-in-out"
        >
          {currentNotice.enlaceImagen && (
            <div
              className="w-full h-48 bg-cover bg-center rounded-lg mb-4 shadow-sm"
              style={{ backgroundImage: `url(${currentNotice.enlaceImagen})` }}
            />
          )}

          <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {currentNotice.titulo}
          </h4>

          <p className="text-gray-700 dark:text-white/90 mb-4 leading-relaxed text-justify tracking-wide">
            {currentNotice.cuerpo}
          </p>

          {currentNotice.enlaceVerMas && (
            <a
              href={currentNotice.enlaceVerMas}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 dark:text-amber-500 dark:text-primary-300 dark:hover:text-amber-300 hover:text-blue-700 dark:hover:text-primary-200 font-medium transition-colors group"
            >
              Ver más
              <svg
                className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          )}
        </div>

        {/* Navigation Controls */}
        {notices.length > 1 && (
          <div className="flex items-center justify-center space-x-6 mt-8 pt-4 border-t border-gray-100 dark:border-gray-700/50">
            <button
              onClick={() =>
                setCurrentIndex(
                  currentIndex === 0 ? notices.length - 1 : currentIndex - 1,
                )
              }
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-amber-400 hover:bg-blue-50 dark:hover:bg-amber-400/10 transition-all duration-300 transform hover:scale-110 focus:outline-none"
              aria-label="Anterior"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex space-x-2.5">
              {notices.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2.5 rounded-full transition-all duration-500 ease-out ${index === currentIndex
                      ? "bg-blue-600 dark:bg-amber-400 w-8"
                      : "bg-gray-300 dark:bg-gray-600 w-2.5 hover:bg-gray-400 dark:hover:bg-gray-500"
                    }`}
                  aria-label={`Ir al aviso ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() =>
                setCurrentIndex(
                  currentIndex === notices.length - 1 ? 0 : currentIndex + 1,
                )
              }
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-amber-400 hover:bg-blue-50 dark:hover:bg-amber-400/10 transition-all duration-300 transform hover:scale-110 focus:outline-none"
              aria-label="Siguiente"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticesCarousel;
