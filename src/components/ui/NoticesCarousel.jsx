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
    }, 5000);

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
        <div className="transition-opacity duration-500">
          {currentNotice.enlaceImagen && (
            <div
              className="w-full h-48 bg-cover bg-center rounded-lg mb-4"
              style={{ backgroundImage: `url(${currentNotice.enlaceImagen})` }}
            />
          )}

          <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {currentNotice.titulo}
          </h4>

          <p className="text-gray-700 dark:text-white/90 mb-4 leading-relaxed">
            {currentNotice.cuerpo}
          </p>

          {currentNotice.enlaceVerMas && (
            <a
              href={currentNotice.enlaceVerMas}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 dark:text-amber-500 dark:text-primary-300 dark:hover:text-amber-300 hover:text-blue-700 dark:hover:text-primary-200 font-medium transition-colors"
            >
              Ver más
              <svg
                className="w-4 h-4 ml-1"
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

        {/* Navigation Dots */}
        {notices.length > 1 && (
          <div className="flex justify-center space-x-2 mt-6">
            {notices.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? "bg-blue-500 dark:bg-amber-500 dark:bg-primary-400"
                    : "bg-gray-400 dark:bg-white/30 hover:bg-gray-500 dark:hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Navigation Arrows */}
        {notices.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentIndex(
                  currentIndex === 0 ? notices.length - 1 : currentIndex - 1,
                )
              }
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800/60 dark:bg-black/20 hover:bg-gray-800/80 dark:hover:bg-black/40 text-white p-2 rounded-full transition-colors"
            >
              <svg
                className="w-5 h-5"
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
            <button
              onClick={() =>
                setCurrentIndex(
                  currentIndex === notices.length - 1 ? 0 : currentIndex + 1,
                )
              }
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800/60 dark:bg-black/20 hover:bg-gray-800/80 dark:hover:bg-black/40 text-white p-2 rounded-full transition-colors"
            >
              <svg
                className="w-5 h-5"
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
          </>
        )}
      </div>
    </div>
  );
};

export default NoticesCarousel;
