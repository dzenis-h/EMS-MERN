import DescriptionForm from "../../mollecul/form/descriptionForm";
import NumberForm from "../../mollecul/form/numberForm";
import UnitForm from "../../mollecul/form/unitForm";
import { useParams } from "react-router-dom";
import {
  useState,
  useContext,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { context } from "../../../context/tabContent";
import type { CreatePenaltyProps, IPenalty } from "../../../interfaces/penalty";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { createPenalty } from "../../../actions/penalty";
import { swalError } from "../../../helpers/swal";

export default function PenaltyForm() {
  const { identifier } = useParams();
  const { setDisplayData } = useContext(context);

  const [data, setData] = useState<CreatePenaltyProps>({
    amount: 0,
    description: "",
    unit: "BAM",
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

    createPenalty(identifier as string, data)
      .then((val: IPenalty) => {
        setDisplayData((prev) => ({
          ...prev,
          penalties: [val, ...prev.penalties],
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
      <label className="form-title">Penalty</label>
      <NumberForm
        value={data.amount.toString()}
        name="amount"
        onChangeHandler={onChangeHandler}
        label="Amount"
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
      <LoadingOverlayWrapper active={loading} spinner>
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
