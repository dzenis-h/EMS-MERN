import type { ChangeEvent } from "react";

export interface EmailFormProps {
  value: string;
  name?: string;
  onChangeHandler: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function EmailForm({
  value,
  name,
  onChangeHandler,
}: EmailFormProps) {
  return (
    <div className="form-group">
      <input
        type="text"
        name={name || "email"}
        value={value}
        required
        className="form-control input-form-data"
        style={{ width: "90%" }}
        onChange={onChangeHandler}
      />
    </div>
  );
}
