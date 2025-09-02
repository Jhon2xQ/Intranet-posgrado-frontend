// Date formatting utilities
export const formatDate = (dateString, locale = 'es-PE') => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

export const formatDateTime = (dateString, locale = 'es-PE') => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString(locale);
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return dateString;
  }
};

// Currency formatting utilities
export const formatCurrency = (amount, currency = 'PEN', locale = 'es-PE') => {
  if (typeof amount !== 'number') return 'S/ 0.00';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `S/ ${amount.toFixed(2)}`;
  }
};

// Number formatting utilities
export const formatNumber = (number, locale = 'es-PE') => {
  if (typeof number !== 'number') return '0';
  
  try {
    return new Intl.NumberFormat(locale).format(number);
  } catch (error) {
    console.error('Error formatting number:', error);
    return number.toString();
  }
};

// Grade formatting utilities
export const formatGrade = (grade, decimals = 2) => {
  if (typeof grade !== 'number') return '0.00';
  return grade.toFixed(decimals);
};

// Text utilities
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const formatFullName = (nombres, apellidoPaterno, apellidoMaterno) => {
  const parts = [nombres, apellidoPaterno, apellidoMaterno].filter(Boolean);
  return parts.join(' ').trim();
};
