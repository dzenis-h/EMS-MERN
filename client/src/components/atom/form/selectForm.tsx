import type { ChangeEvent } from "react";

export interface SelectFormProps {
  datas: {
    label: string;
    value: string;
  }[];
  name: string;
  onChangeHandler: (e: ChangeEvent<HTMLSelectElement>) => void;
  label: string;
  value: string;
}

export default function SelectForm({
  datas,
  name,
  label,
  value,
  onChangeHandler,
}: SelectFormProps) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <select
        name={name}
        className="form-control"
        required
        value={value}
        defaultValue=""
        onChange={onChangeHandler}
      >
        <option selected disabled value="">
          --select --
        </option>
        {datas.map(({ value, label }) => (
          <option key={label} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
