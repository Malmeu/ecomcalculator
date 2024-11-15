import { Input } from './input';
import { Label } from './label';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: string;
  required?: boolean;
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
}: NumberInputProps) {
  return (
    <div className="grid gap-4">
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}