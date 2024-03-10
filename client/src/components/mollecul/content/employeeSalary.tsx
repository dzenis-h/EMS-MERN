import type { EmployeeSalaryDetail } from "../../../interfaces/employee";

export interface EmployeeSalaryListProps {
  item: EmployeeSalaryDetail;
}

export default function EmployeeSalaryList({ item }: EmployeeSalaryListProps) {
  return (
    <tr>
      <td className="salaries-table__decoration">{item.surname}</td>
      <td>{item.salary}</td>
      <td className="salaries-table__decoration">{item.takeHomePay}</td>
      <td>{item.salary}</td>
      <td>{item.totalBonus}</td>
      <td>{item.totalPenalties}</td>
      <td className="salaries-table__decoration">{item.takeHomePay}</td>
      <td>{item?.loanDetail?.totalLoan || "No-Data"}</td>
      <td>{item.totalInstallment}</td>
      <td>{item?.loanDetail?.note || "No-Data"}</td>
    </tr>
  );
}
