import type { ChangeEvent } from "react";

export interface NumberFormProps {
  value: string;
  name: string;
  label: string;
  min?: number;
  max?: number;
  onChangeHandler: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function NumberForm({
  value,
  name,
  onChangeHandler,
  label,
  min,
  max,
}: NumberFormProps) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        name={name}
        type="number"
        value={value}
        className="form-control"
        required
        onChange={onChangeHandler}
        min={min}
        max={max}
      />
    </div>
  );
}
