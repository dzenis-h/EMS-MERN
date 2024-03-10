import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type SyntheticEvent,
} from "react";
import DatePicker from "../../atom/form/datePicker";
import type { AddEmployeeState } from "../../../interfaces/employee";
import { swalError } from "../../../helpers/swal";
import { addEmployee } from "../../../actions/employee";
import { useDispatch } from "react-redux";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import SelectForm from "../../atom/form/selectForm";

export default function AddEmployeeForm() {
  const dispatch = useDispatch();
  const defaultValue = {
    name: "",
    surname: "",
    JMBG: "",
    birthdate: new Date().toString(),
    gender: "",
    position: "",
    startdate: new Date().toString(),
    isPayoneer: false,
    salaryAmount: 0,
  };
  const [data, setData] = useState<AddEmployeeState>(defaultValue);
  const [loading, setLoading] = useState<boolean>(false);

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const datePickerChangeHandler =
    (field: "birthdate" | "startdate") =>
    (date: Date | null, e: SyntheticEvent<any, Event>) => {
      if (date)
        setData((prev) => ({
          ...prev,
          [field]: date?.toString(),
        }));
    };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    for (const key in data)
      if (!(data as any)[key] && key !== 'isPayoneer') {
        swalError(`${key} is required`);
        setLoading(false);
        return;
      }

    dispatch<any>(addEmployee(data))
      .then(() => {
        setData(defaultValue);
      })
      .catch((err: Error) => {
        swalError(err?.message || "Internal Server Error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="form-group form__small">
        <label htmlFor="name">Name</label>
        <input
          name="name"
          type="text"
          className="form-control"
          required
          onChange={onChangeHandler}
          value={data.name}
        />
      </div>

      <div className="form-group form__small form__small--right">
        <label htmlFor="surname">Surname</label>
        <input
          name="surname"
          value={data.surname}
          type="text"
          className="form-control"
          required
          onChange={onChangeHandler}
        />
      </div>

      <div className="form-group">
        <label htmlFor="jmbg">JMBG</label>
        <input
          name="JMBG"
          value={data.JMBG}
          type="text"
          className="form-control"
          required
          onChange={onChangeHandler}
        />
      </div>

      <div className="form-group">
        <label htmlFor="birthdate">Date Of Birth</label>
        <DatePicker
          name="birthdate"
          value={data.birthdate}
          onChangeHandler={datePickerChangeHandler("birthdate")}
        />
      </div>

      <SelectForm
        name="gender"
        value={data.gender}
        label="Gender"
        onChangeHandler={onChangeHandler}
        datas={[
          { label: "Male", value: "M" },
          { label: "Female", value: "F" },
        ].map(({ label, value }) => ({ label, value }))}
      />

      <hr></hr>

      <div className="form-group">
        <label htmlFor="position">Position</label>
        <input
          name="position"
          value={data.position}
          type="text"
          className="form-control"
          required
          onChange={onChangeHandler}
        />
      </div>

      <div className="form-group">
        <label htmlFor="startdate">Start Date</label>
        <DatePicker
          name="startdate"
          value={data.startdate}
          onChangeHandler={datePickerChangeHandler("startdate")}
        />
      </div>

      <div className="form-group">
        <input
          name="isPayoneer"
          className="form__small--check"
          value={String(data.isPayoneer)}
          type="checkbox"
          onChange={onChangeHandler}
        />
        <label htmlFor="isPayoneer" className="form__small--check__label">
          Is Payoneer
        </label>
      </div>

      <div className="form-group">
        <label htmlFor="salaryAmount">Salary</label>
        <input
          name="salaryAmount"
          value={data.salaryAmount}
          type="number"
          className="form-control"
          required
          onChange={onChangeHandler}
        />
      </div>

      <LoadingOverlayWrapper spinner text="...loading" active={loading}>
        <button type="submit" className="btn btn-primary submit-button">
          Submit
        </button>
      </LoadingOverlayWrapper>
    </form>
  );
}
