import DateTimePicker from "react-datepicker";
import type { SyntheticEvent } from "react";

export interface DatePickerProps {
  value: string;
  onChangeHandler: (date: Date | null, e: SyntheticEvent<any, Event>) => void;
  name: string;
}

export default function DatePicker({
  value,
  onChangeHandler,
  name,
}: DatePickerProps) {
  return (
    <DateTimePicker
      selected={!!value ? new Date(value) : new Date()}
      onChange={onChangeHandler}
      onSelect={onChangeHandler}
      name={name}
      showTimeSelect
      dateFormat="dd/MM/yyyy"
      showTimeInput={false}
    />
  );
}
