import { CreateBonus } from "../../../actions/bonus";
import { context } from "../../../context/tabContent";
import { swalError } from "../../../helpers/swal";
import type { BonusFormProps } from "../../../interfaces/bonus";
import DatePicker from "../../atom/form/datePicker";
import CheckboxForm from "../../mollecul/form/checkboxForm";
import DescriptionForm from "../../mollecul/form/descriptionForm";
import NumberForm from "../../mollecul/form/numberForm";
import { useState, useContext, type ChangeEvent, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import UnitForm from "../../mollecul/form/unitForm";

export default function BonusForm() {
  const { identifier } = useParams();
  const [data, setData] = useState<BonusFormProps>({
    amount: 0,
    date: new Date().toString(),
    description: "",
    isRepeating: false,
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

  const datePickerHandler = (date: Date | null) => {
    if (date)
      setData((prev) => ({
        ...prev,
        date: date.toISOString(),
      }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    CreateBonus(identifier as string, data)
      .then((val) => {
        setDisplayData((prev) => ({
          ...prev,
          bonuses: [val, ...prev.bonuses],
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
      <label className="form-title">Bonus</label>
      <div className="form-group">
        <label htmlFor="date">Date</label>
        <DatePicker
          value={data.date}
          onChangeHandler={datePickerHandler}
          name="date"
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
        value={data.description}
        name="description"
        onChangeHandler={onChangeHandler}
      />
      <CheckboxForm
        name="isRepeating"
        value={String(data.isRepeating)}
        onChangeHandler={onChangeHandler}
        label="Is repeating"
      />
      <button
        disabled={loading}
        type="submit"
        className="btn btn-primary submit-button">
        Submit
      </button>
    </form>
  );
}
