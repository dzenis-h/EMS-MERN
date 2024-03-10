import type { SummaryLoan } from "../../../interfaces/loan";

export interface SummaryLoanDataProps {
  data: SummaryLoan;
}

export default function SummaryLoanData({
  data: {
    surname,
    totalAmount,
    totalPayed,
    remainingDebt,
    remainingInstallment,
  },
}: SummaryLoanDataProps) {
  return (
    <tr>
      <th>{surname}</th>
      <th>{totalAmount}</th>
      <th>{totalPayed}</th>
      <th>{remainingInstallment}</th>
      <th>{remainingDebt}</th>
    </tr>
  );
}
