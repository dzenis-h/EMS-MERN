import { getEmployeeName } from "../../../actions/employee";
import type { EmployeeState } from "../../../reducer/employee";
import type { RootReducer } from "../../../store";
import SelectForm from "../../atom/form/selectForm";
import { type ChangeEvent, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

export interface EmployeeSelectProps {
  onChangeHandler: (e: ChangeEvent<HTMLSelectElement>) => void;
  name: string;
  value: string;
}

export default function EmployeeSelect({
  onChangeHandler,
  name,
  value,
}: EmployeeSelectProps) {
  const dispatch = useDispatch();
  const { employeeNames } = useSelector<RootReducer, EmployeeState>(
    ({ employeeReducer }) => employeeReducer
  );

  useEffect(() => {
    if (!employeeNames.length) dispatch<any>(getEmployeeName());
  }, [employeeNames.length]);

  return (
    <SelectForm
      name={name}
      value={value}
      label="Employee"
      datas={employeeNames.map(({ surname, _id }) => ({
        value: _id,
        label: surname,
      }))}
      onChangeHandler={onChangeHandler}
    />
  );
}
