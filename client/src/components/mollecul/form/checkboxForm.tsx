import type { ChangeEvent } from "react";

export interface CheckboxFormProps {
  name: string;
  value: string;
  label: string;
  onChangeHandler: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export default function CheckboxForm({
  name,
  value,
  label,
  onChangeHandler,
  required = false,
}: CheckboxFormProps) {
  return (
    <div className="form-group">
      <input
        name={name}
        className="form__small--check"
        type="checkbox"
        value={value}
        onChange={onChangeHandler}
        required={required}
      />
      <label htmlFor={name} className="form__small--check__label">
        {label}
      </label>
    </div>
  );
}
