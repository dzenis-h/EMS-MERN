import DatePicker from "../../atom/form/datePicker";
import DescriptionForm from "../../mollecul/form/descriptionForm";
import NumberForm from "../../mollecul/form/numberForm";
import { swalError } from "../../../helpers/swal";
import { useParams } from "react-router-dom";
import { context } from "../../../context/tabContent";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import {
  useState,
  useContext,
  type FormEvent,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import type { CreateLoanPaymentProps } from "../../../interfaces/loan";
import UnitForm from "../../mollecul/form/unitForm";
import { createLoanExtraPayment } from "../../../actions/loan";
import type { ILoanPayment } from "../../../interfaces/loanPayment";

export default function LoanPaymentForm() {
  const { identifier } = useParams();
  const [data, setData] = useState<CreateLoanPaymentProps>({
    date: new Date().toString(),
    description: "",
    amount: 0,
    unit: "BAM",
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
    createLoanExtraPayment(identifier as string, data)
      .then((val: ILoanPayment) => {
        setDisplayData((prev) => ({
          ...prev,
          loanPayments: [val, ...prev.loanPayments],
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
      <label className="form-title">Loan Payment</label>
      <div className="form-group">
        <label htmlFor="date">Date</label>
        <DatePicker
          name="date"
          value={data.date}
          onChangeHandler={datePickerHandler}
        />
      </div>
      <NumberForm
        label="Amount"
        name="amount"
        value={data.amount.toString()}
        onChangeHandler={onChangeHandler}
      />
      <UnitForm
        name="unit"
        value={data.unit}
        onChangeHandler={onChangeHandler}
      />
      <DescriptionForm
        label="Description"
        name="description"
        value={data.description}
        onChangeHandler={onChangeHandler}
      />
      <LoadingOverlayWrapper spinner active={loading}>
        <button
          type="submit"
          className="btn btn-primary submit-button"
          disabled={loading}>
          Submit
        </button>
      </LoadingOverlayWrapper>
    </form>
  );
}
