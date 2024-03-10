import LoadingOverlayWrapper from "react-loading-overlay-ts";
import type { CreateLoanProps } from "../../../interfaces/loan";
import DatePicker from "../../atom/form/datePicker";
import DescriptionForm from "../../mollecul/form/descriptionForm";
import NumberForm from "../../mollecul/form/numberForm";
import UnitForm from "../../mollecul/form/unitForm";
import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type SyntheticEvent,
  useContext,
} from "react";
import { createLoan } from "../../../actions/loan";
import { swalError } from "../../../helpers/swal";
import { useParams } from "react-router-dom";
import { context } from "../../../context/tabContent";

export default function LoanForm() {
  const { identifier } = useParams();
  const [data, setData] = useState<CreateLoanProps>({
    amount: 0,
    unit: "BAM",
    date: new Date().toString(),
    period: 0,
    note: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const { setDisplayData } = useContext(context);

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

    setLoading(true);

    createLoan(identifier as string, data)
      .then((val) => {
        setDisplayData((prev) => ({
          ...prev,
          loans: [val, ...prev.loans],
        }));
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

      <DescriptionForm
        name="note"
        label="note (optional)"
        value={data.note || ""}
        required={false}
        onChangeHandler={onChangeHandler}
      />

      <LoadingOverlayWrapper spinner active={loading}>
        <button
          disabled={loading}
          type="submit"
          className="btn btn-primary submit-button">
          Submit
        </button>
      </LoadingOverlayWrapper>
    </form>
  );
}
