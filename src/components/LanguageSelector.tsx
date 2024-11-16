import { Language } from '@/lib/i18n';

interface LanguageSelectorProps {
  value: Language;
  onChange: (value: Language) => void;
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Language)}
      className="p-2 rounded bg-gray-700/50 border-gray-600 text-white font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
    >
      <option value="fr" className="bg-gray-800 text-white">Français</option>
      <option value="en" className="bg-gray-800 text-white">English</option>
      <option value="ar" className="bg-gray-800 text-white">العربية</option>
    </select>
  );
}