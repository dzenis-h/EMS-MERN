import type { ChangeEvent } from "react";
import SelectForm from "../../atom/form/selectForm";

export interface UnitFormProps {
  onChangeHandler: (e: ChangeEvent<HTMLSelectElement>) => void;
  name: string;
  value: string;
}

export default function UnitForm({
  onChangeHandler,
  name,
  value,
}: UnitFormProps) {
  return (
    <SelectForm
      name={name}
      value={value}
      onChangeHandler={onChangeHandler}
      label="Unit"
      datas={["BAM", "$"].map((el) => ({ value: el, label: el }))}
    />
  );
}
