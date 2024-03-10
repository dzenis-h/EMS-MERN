import type { DisplaySalaryTab } from "../../../interfaces";

export interface SalaryUnitDetailProps {
  data: DisplaySalaryTab;
}

export default function SalaryUnitDetail({ data }: SalaryUnitDetailProps) {
  return (
    <tr>
      <td className="col-md-4">{data.surname}</td>
      <td className="col-md-4">{data.date}</td>
      <td className="col-md-4">{data.amount} $</td>
      <td className="col-md-4">{data.description}</td>
    </tr>
  );
}
