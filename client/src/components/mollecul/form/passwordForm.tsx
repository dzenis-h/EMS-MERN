import { useState, type ChangeEvent } from "react";

export interface PasswordFormProps {
  value: string;
  name?: string;
  onChangeHandler: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function PasswordForm({
  value,
  name,
  onChangeHandler,
}: PasswordFormProps) {
  const [hide, setHide] = useState<boolean>(true);

  const onClickHandler = () => {
    setHide(!hide);
  };

  const eye = hide ? "fas fa-eye" : "fas fa-eye-slash"

  return (
    <div className="form-group">
      <input
        type={hide ? "password" : "text"}
        name={name || "password"}
        value={value}
        required
        className="form-control input-form-data"
        style={{ width: "90%" }}
        onChange={onChangeHandler}
      />
      <button type="button" id="togglePasswordBtn" onClick={onClickHandler}>
        <i className={eye}></i>
      </button>
    </div>
  );
}
