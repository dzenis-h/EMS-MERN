import type { EmployeeSalaryDetail } from "../../../interfaces/employee";

export interface SalaryPreviewDataProps {
  item: EmployeeSalaryDetail;
}

export default function SalaryPreviewData({ item }: SalaryPreviewDataProps) {
  return (
    <tr>
      <td>{item.surname}</td>
      <td>
        {item.takeHomePay}
        {/* {totalNumberOfPayoneerSalaries} - {totalNumberOfHandSalaries} */}
      </td>
      <td>{item.salary + item.totalBonus}</td>
      <td>{item.tax}</td>
      <td>{item.totalBonus}</td>
      <td>{item.totalPenalties}</td>
      <td>{item.takeHomePay}</td>
      <td>{item.loanDetail?.totalLoan || 0}</td>
      <td>{item.loanDetail?.installment || 0}</td>
      <td>{item.loanDetail?.note || "N/A"}</td>
    </tr>
  );
}
