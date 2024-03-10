import DescriptionForm from "../../mollecul/form/descriptionForm";
import NumberForm from "../../mollecul/form/numberForm";
import UnitForm from "../../mollecul/form/unitForm";
import {
  useState,
  type FormEvent,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import type {
  CreateBulkLoanResp,
  CreateLoanProps,
} from "../../../interfaces/loan";
import DatePicker from "../../atom/form/datePicker";
import EmployeeSelect from "../../mollecul/form/employeeSelectId";
import { swalError } from "../../../helpers/swal";
import { useDispatch } from "react-redux";
import { bulkCreateEmployeeLoan } from "../../../actions/loan";
import LoadingOverlayWrapper from "react-loading-overlay-ts";

export default function MultipleLoanForm() {
  const dispatch = useDispatch();
  const defaultValue: CreateLoanProps & { employeeId: string } = {
    amount: 0,
    unit: "BAM",
    date: new Date().toString(),
    period: 0,
    note: "",
    employeeId: "",
  };
  const [data, setData] = useState<CreateLoanProps & { employeeId: string }>(
    defaultValue
  );
  const [loanForm, setLoanForms] = useState<
    (CreateLoanProps & { employeeId: string })[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const datePickerHandler = (
    date: Date | null,
    e: SyntheticEvent<any, Event>
  ) => {
    if (date)
      setData((prev) => ({
        ...prev,
        date: date.toISOString(),
      }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    for (const key in data)
      if (
        !(data as any)[key] &&
        !["description", "note", "date"].includes(key)
      ) {
        swalError(`${key} is required`);
        return;
      }

    setLoanForms((prev) => [data, ...prev]);
    setData(defaultValue);
  };

  const submitLoans = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setLoading(true);
    dispatch<any>(bulkCreateEmployeeLoan(loanForm))
      .then((val: CreateBulkLoanResp) => {
        setLoanForms([]);
      })
      .catch((err: Error) => {
        swalError(err?.message || "Internal Server Error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form className="portlet-body" onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="date">Date</label>
        <DatePicker
          onChangeHandler={datePickerHandler}
          value={data.date}
          name="date"
        />
      </div>
      <NumberForm
        value={data.amount.toString()}
        name="amount"
        onChangeHandler={onChangeHandler}
        label="Amount"
      />
      <NumberForm
        value={data.period.toString()}
        min={1}
        max={12}
        name="period"
        onChangeHandler={onChangeHandler}
        label="Period"
      />

      <UnitForm
        name="unit"
        value={data.unit}
        onChangeHandler={onChangeHandler}
      />

      <EmployeeSelect
        onChangeHandler={onChangeHandler}
        value={data.employeeId}
        name="employeeId"
      />

      <DescriptionForm
        name="note"
        label="note (optional)"
        value={data.note || ""}
        required={false}
        onChangeHandler={onChangeHandler}
      />

      <button
        type="submit"
        style={{ float: "left" }}
        className="btn btn-primary">
        Save loan
      </button>

      {!!loanForm.length && (
        <LoadingOverlayWrapper spinner active={loading}>
          <button
            disabled={loading}
            type="button"
            style={{ float: "right" }}
            className="btn btn-primary"
            onClick={submitLoans}>
            Submit Loan(s)
          </button>
        </LoadingOverlayWrapper>
      )}
    </form>
  );
}
