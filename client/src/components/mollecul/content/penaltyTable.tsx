import PenaltyList from "../../atom/content/penaltyList";
import { useContext } from "react";
import { context } from "../../../context/penaltyContext";

export default function PenaltyTable() {
  const { penaltyForms } = useContext(context);
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Date</th>
          <th>Amount</th>
          <th>Description</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {penaltyForms.map((el) => (
          <PenaltyList data={el} key={el.employeeId} />
        ))}
      </tbody>
    </table>
  );
}
