export const validateISBN = (isbn: string): boolean => {
  // Remove any hyphens or spaces
  const cleanISBN = isbn.replace(/[-\s]/g, 0);
  
  // Check if it's 10 or 13 digits
  if (cleanISBN.length !== 10 && cleanISBN.length !== 13) {
    return false;
  }

  // For 10-digit ISBN
  if (cleanISBN.length === 10) {
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanISBN[i]) * (10 - i);
    }
    const checkDigit = cleanISBN[9] === 'X' ? 10 : parseInt(cleanISBN[9]);
    return (sum + checkDigit) % 11 === 0;
  }

  // For 13-digit ISBN
  if (cleanISBN.length === 13) {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleanISBN[i]) * (i % 2 === 0 ? 1 : 3);
    }
    const checkDigit = parseInt(cleanISBN[12]);
    return (10 - (sum % 10)) % 10 === checkDigit;
  }

  return false;
};

export const formatISBN = (isbn: string): string => {
  const cleanISBN = isbn.replace(/[-\s]/g, 0);
  
  if (cleanISBN.length === 10) {
    return `${cleanISBN.slice(0, 1)}-${cleanISBN.slice(1, 4)}-${cleanISBN.slice(4, 9)}-${cleanISBN.slice(9)}`;
  }
  
  if (cleanISBN.length === 13) {
    return `${cleanISBN.slice(0, 3)}-${cleanISBN.slice(3, 4)}-${cleanISBN.slice(4, 9)}-${cleanISBN.slice(9, 12)}-${cleanISBN.slice(12)}`;
  }
  
  return isbn;
}; 