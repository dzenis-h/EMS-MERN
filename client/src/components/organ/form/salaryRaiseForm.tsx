import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { raiseSalary } from "../../../actions/salary";
import { context } from "../../../context/tabContent";
import { swalError } from "../../../helpers/swal";
import { UpdateSalaryProps } from "../../../interfaces/salary";
import DescriptionForm from "../../mollecul/form/descriptionForm";
import NumberForm from "../../mollecul/form/numberForm";
import { useState, useContext, type ChangeEvent, type FormEvent } from "react";
import { useParams } from "react-router-dom";

export default function SalaryRaise() {
  const { identifier } = useParams();
  const { setDisplayData, salary } = useContext(context);
  const [data, setData] = useState<UpdateSalaryProps>({
    amount: salary.amount,
    description: "",
  });
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

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    raiseSalary(identifier as string, data)
      .then((val) => {
        setDisplayData((prev) => ({
          ...prev,
          salary: { ...val },
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
      <label className="form-title"> Salary Raise</label>
      <NumberForm
        onChangeHandler={onChangeHandler}
        name="amount"
        value={data.amount.toString()}
        label="Amount"
      />
      <DescriptionForm
        label="Description"
        name="description"
        value={data.description}
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
