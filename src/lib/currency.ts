import { CurrencyCode } from '../types';

export const CURRENCIES: { code: CurrencyCode; symbol: string; name: string }[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: '$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: '$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CHF', symbol: 'Fr.', name: 'Swiss Franc' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Złoty' },
  { code: 'NZD', symbol: '$', name: 'New Zealand Dollar' },
  { code: 'SGD', symbol: '$', name: 'Singapore Dollar' },
  { code: 'HKD', symbol: '$', name: 'Hong Kong Dollar' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  { code: 'DKK', symbol: 'kr.', name: 'Danish Krone' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'ILS', symbol: '₪', name: 'Israeli New Shekel' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
];

// Predefined exchange rates with USD as the base (1 USD = X Currency)
// Approximate 2024 market values
export const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.36,
  AUD: 1.51,
  JPY: 151.45,
  CHF: 0.91,
  SEK: 10.55,
  PLN: 4.02,
  NZD: 1.67,
  SGD: 1.34,
  HKD: 7.82,
  MXN: 17.10,
  DKK: 6.88,
  NOK: 10.60,
  ILS: 3.65,
  BRL: 5.05,
  CZK: 23.40,
};

/**
 * Validates if a string is a valid CurrencyCode.
 */
export const isValidCurrencyCode = (code: string): code is CurrencyCode => {
  return CURRENCIES.some(c => c.code === code);
};

/**
 * Returns full metadata for a given currency code.
 * Always returns a valid object, falling back to USD if not found.
 */
export function getCurrencyDetails(code: CurrencyCode): { code: CurrencyCode; symbol: string; name: string } {
  return CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
}

/**
 * Converts an amount from one currency to another using predefined rates.
 */
export const convertCurrency = (amount: number, from: string, to: string): number => {
  if (!isValidCurrencyCode(from)) {
    from = 'USD';
  }
  if (!isValidCurrencyCode(to)) {
    to = 'USD';
  }

  const fromCode = from as CurrencyCode;
  const toCode = to as CurrencyCode;

  if (fromCode === toCode) return amount;
  
  // Convert to USD base first
  const inUSD = amount / EXCHANGE_RATES[fromCode];
  // Convert from USD base to target
  return inUSD * EXCHANGE_RATES[toCode];
};

export const getCurrencySymbol = (code: string): string => {
  if (isValidCurrencyCode(code)) {
    return getCurrencyDetails(code as CurrencyCode).symbol;
  }
  return '$';
};

export const formatCurrency = (value: number, code: string): string => {
  const validCode = isValidCurrencyCode(code) ? code : 'USD';
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: validCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (error) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
};