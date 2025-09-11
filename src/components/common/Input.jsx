import React from "react";

const Input = ({
  label,
  error,
  className = "",
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required,
  disabled,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`block w-full px-3 py-2 border border-neutral-400 dark:border-card-border rounded-lg shadow-sm placeholder-neutral-400 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-card-dark text-neutral-900 ${error ? "border-yellow-400 focus:ring-yellow-300" : ""} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-yellow-600 dark:text-yellow-400">{error}</p>
      )}
    </div>
  );
};

export default Input;
