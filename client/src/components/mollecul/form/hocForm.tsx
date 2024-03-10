import { useParams } from "react-router-dom";
import {
  useContext,
  type Dispatch,
  type SetStateAction,
  type ChangeEvent,
  type FormEvent,
  useState,
  type FC,
  type SyntheticEvent,
} from "react";
import { context } from "../../../context/tabContent";
import { swalError } from "../../../helpers/swal";
import type { TabEmployeeContext } from "../../../interfaces/context";

export type HOCFormProps<T = any, K = any> = {
  Children: FC<{
    loading: boolean;
    onChangeHandler: (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
    datePickerHandler?: (
      date: Date | null,
      e: SyntheticEvent<any, Event>
    ) => void;
    setDisplayData:Dispatch<SetStateAction<TabEmployeeContext>>
  }>;
  state: T;
  setState: Dispatch<SetStateAction<T>>;
  submitFunc: (identifier: string, data: T) => Promise<K>;
  setDisplayFunc:(data:K) => void
};

export default function HOCForm({
  Children,
  setState,
  state,
  submitFunc,
  setDisplayFunc,
}: HOCFormProps) {
  const { identifier } = useParams();
  const { setDisplayData } = useContext(context);
  const [loading, setLoading] = useState<boolean>(false);

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setState((prev: typeof state) => ({
      ...prev,
      [name]: value,
    }));
  };

  const datePickerHandler = (
    date: Date | null,
    e: SyntheticEvent<any, Event>
  ) => {
    if (date)
      setState((prev: typeof state) => ({
        ...prev,
        date: date.toISOString(),
      }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    submitFunc(identifier as string, state)
      .then(setDisplayFunc)
      .catch((err: Error) => {
        swalError(err?.message || "Internal Server Error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form onSubmit={onSubmit}>
      <Children
      setDisplayData={setDisplayData}
        loading={loading}
        onChangeHandler={onChangeHandler}
        datePickerHandler={datePickerHandler}
      />
    </form>
  );
}
