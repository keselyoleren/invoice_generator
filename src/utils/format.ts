interface FormatOptions {
  locale: string;
  currency: string;
  minimumFractionDigits: number;
  maximumFractionDigits: number;
}

const currencyFormats: Record<string, FormatOptions> = {
  idr: {
    locale: 'id-ID',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  },
  usd: {
    locale: 'en-US',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }
};

export const formatCurrency = (amount: number, currency: 'idr' | 'usd' = 'idr'): string => {
  const options = currencyFormats[currency];
  return new Intl.NumberFormat(options.locale, {
    style: 'currency',
    currency: options.currency,
    minimumFractionDigits: options.minimumFractionDigits,
    maximumFractionDigits: options.maximumFractionDigits
  }).format(amount);
};

interface DateFormatOptions {
  locale: string;
  year: 'numeric';
  month: 'long' | 'short';
  day: 'numeric';
}

const dateFormats: Record<string, DateFormatOptions> = {
  id: {
    locale: 'id-ID',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  },
  en: {
    locale: 'en-US',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
};

const shortDateFormats: Record<string, DateFormatOptions> = {
  id: {
    locale: 'id-ID',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  },
  en: {
    locale: 'en-US',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
};

export const formatDate = (dateString: string, language: 'id' | 'en' = 'id'): string => {
  const options = dateFormats[language];
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(options.locale, options).format(date);
};

export const shortFormatDate = (dateString: string, language: 'id' | 'en' = 'id'): string => {
  const options = shortDateFormats[language];
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(options.locale, options).format(date);
};