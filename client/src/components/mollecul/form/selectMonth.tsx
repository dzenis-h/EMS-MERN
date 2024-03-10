import { months } from "../../../constant/month";
import SelectForm from "../../atom/form/selectForm";
import type { ChangeEvent } from "react";

export interface SelectMonthProps {
  name: string;
  value: string;
  onChangeHandler: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export default function SelectMonth({
  name,
  value,
  onChangeHandler,
}: SelectMonthProps) {
  return (
    <SelectForm
      name={name}
      value={value}
      onChangeHandler={onChangeHandler}
      label="Month"
      datas={months.map(({ value, label }) => ({
        value: value.toString(),
        label,
      }))}
    />
  );
}
