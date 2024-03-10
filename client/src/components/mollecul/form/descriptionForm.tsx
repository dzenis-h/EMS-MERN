import type { ChangeEvent } from "react";

export interface DescriptionFormProps {
  value: string;
  name: string;
  onChangeHandler: (e: ChangeEvent<any>) => void;
  required?: boolean;
  label: string;
}

export default function DescriptionForm({
  value,
  label,
  name,
  onChangeHandler,
  required = false,
}: DescriptionFormProps) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <textarea
        name={name}
        className="form-control"
        required={required}
        value={value}
        onChange={onChangeHandler}
      />
    </div>
  );
}
