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
      {helperText && (
        <p className="text-sm text-muted-foreground mt-1">{helperText}</p>
      )}
    </div>
  );
}