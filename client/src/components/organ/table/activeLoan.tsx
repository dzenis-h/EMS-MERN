import { useSelector } from "react-redux";
import type { RootReducer } from "../../../store";
import type { LoanState } from "../../../reducer/loan";
import LoanData from "../../mollecul/content/loanData";

export default function ActiveLoan() {
  const { loans } = useSelector<RootReducer, LoanState>(
    ({ loanReducer }) => loanReducer
  );
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Active Loan</th>
          <th>Current Installment</th>
          <th>Still Remaining</th>
          <th>Note</th>
        </tr>
      </thead>
      <tbody>
        {loans.map((el) => (
          <LoanData data={el} key={el._id} />
        ))}
      </tbody>
    </table>
  );
}
