import { Input } from './input';
import { Label } from './label';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export function NumberInput({
  label,
  value,
  onChange,
  placeholder,
  min,
  max,
  step = '0.01',
  required,
  helperText,
  icon,
}: NumberInputProps) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-white font-bold">
        {icon}
        <span>{label}</span>
        {required && <span className="text-red-400">*</span>}
      </Label>
      <div className="relative">
        <Input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="bg-gray-700/50 border-gray-600 focus:border-blue-500 rounded-xl pl-4 text-white placeholder:text-gray-400"
        />
      </div>
      {helperText && (
        <p className="text-sm text-gray-400">{helperText}</p>
      )}
    </div>
  );
}