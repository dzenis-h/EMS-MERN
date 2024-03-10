import type { EmployeeSalaryDetailPerMonth } from "../../../interfaces/report";

export interface ReportEmployeeSalaryProps {
  data: EmployeeSalaryDetailPerMonth;
  idx: number;
}

export default function ReportEmployeeSalary({
  data,
  idx,
}: ReportEmployeeSalaryProps) {
  return (
    <tr>
      <td>{idx + 1}</td>
      <td>{data.net}</td>
      <td>{data.gross}</td>
      <td>{data.penalties}</td>
      <td>{data.bonuses}</td>
      <td>{data.tax}</td>
      <td>{data.salary}</td>
    </tr>
  );
}
