import React from 'react';

const Input = ({ 
  label, 
  error, 
  className = '', 
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required,
  disabled,
  ...props 
}) => {
  const inputClasses = `input-field ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`;
  
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
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
        className={`block w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg shadow-sm placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-unsaac-500 focus:border-unsaac-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;
