import React from "react";

const NotificationToast = ({ notifications, onRemove }) => {
  if (!notifications.length) return null;

  const getTypeStyles = (type) => {
    const styles = {
      success: "bg-green-500 text-white",
      error: "bg-red-500 text-white",
      warning: "bg-yellow-500 text-white",
      info: "bg-blue-500 text-white",
    };
    return styles[type] || styles.info;
  };

  const getIcon = (type) => {
    const icons = {
      success: "✓",
      error: "✕",
      warning: "⚠",
      info: "ℹ",
    };
    return icons[type] || icons.info;
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center p-4 rounded-lg shadow-lg max-w-sm animate-slide-in ${getTypeStyles(notification.type)}`}
        >
          <span className="mr-3 text-lg">{getIcon(notification.type)}</span>
          <p className="flex-1 text-sm font-medium">{notification.message}</p>
          <button
            onClick={() => onRemove(notification.id)}
            className="ml-3 text-white hover:text-gray-200 focus:outline-none"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
