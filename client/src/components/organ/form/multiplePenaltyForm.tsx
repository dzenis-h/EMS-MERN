import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { createBulkPenalty } from "../../../actions/penalty";
import { context } from "../../../context/penaltyContext";
import { swalError } from "../../../helpers/swal";
import type { CreatePenaltyProps } from "../../../interfaces/penalty";
import DescriptionForm from "../../mollecul/form/descriptionForm";
import EmployeeSelect from "../../mollecul/form/employeeSelectId";
import NumberForm from "../../mollecul/form/numberForm";
import UnitForm from "../../mollecul/form/unitForm";
import {
  type ChangeEvent,
  type FormEvent,
  useState,
  useContext,
  type MouseEventHandler,
} from "react";

export default function MultiplePenaltyForm() {
  const { setPenaltyForms, penaltyForms } = useContext(context);

  const defaultValue: CreatePenaltyProps & { employeeId: string } = {
    amount: 0,
    description: "",
    employeeId: "",
    unit: "BAM",
  };
  const [loading, setLoading] = useState<boolean>(false);

  const [data, setData] = useState<CreatePenaltyProps & { employeeId: string }>(
    defaultValue
  );

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

    for (const key in data)
      if (!(data as any)[key] && !["description", "date"].includes(key)) {
        swalError(`${key} is required`);
        return;
      }

    setPenaltyForms((prev) => [data, ...prev]);
    setData(defaultValue);
  };

  const submitPenalty: MouseEventHandler = (e) => {
    e.preventDefault();
    setLoading(true);

    createBulkPenalty(penaltyForms)
      .then(() => {
        setPenaltyForms([]);
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
      <EmployeeSelect
        name="employeeId"
        value={data.employeeId}
        onChangeHandler={onChangeHandler}
      />
      <NumberForm
        name="amount"
        value={data.amount.toString()}
        onChangeHandler={onChangeHandler}
        label="Amount"
      />
      <UnitForm
        onChangeHandler={onChangeHandler}
        name="unit"
        value={data.unit}
      />
      <DescriptionForm
        name="description"
        value={data.description}
        onChangeHandler={onChangeHandler}
        label="Description"
      />

      <button
        type="submit"
        className="btn btn-primary"
        style={{ float: "left" }}>
        Add penalty
      </button>

      {!!penaltyForms.length && (
        <LoadingOverlayWrapper spinner active={loading}>
          <button
            type="button"
            disabled={loading}
            className="btn btn-primary"
            style={{ float: "right" }}
            onClick={submitPenalty}>
            Save all penalties
          </button>
        </LoadingOverlayWrapper>
      )}
    </form>
  );
}
