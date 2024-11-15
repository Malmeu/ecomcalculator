import { Language } from '@/lib/i18n';

interface PriceDisplayProps {
  price: number;
  currency: string;
  label: string;
  lang: Language;
}

export function PriceDisplay({ price, currency, label, lang }: PriceDisplayProps) {
  const formatOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  const locales = {
    en: 'en-US',
    fr: 'fr-DZ',
    ar: 'ar-DZ',
  };

  const formattedPrice = price.toLocaleString(locales[lang], formatOptions);
  const isRTL = lang === 'ar';

  return (
    <div className="pt-6 text-center">
      <h2 className="text-lg font-semibold text-muted-foreground">{label}</h2>
      <p className="text-4xl font-bold mt-2">
        {isRTL ? (
          <>
            {formattedPrice} {currency}
          </>
        ) : (
          <>
            {currency} {formattedPrice}
          </>
        )}
      </p>
    </div>
  );
}