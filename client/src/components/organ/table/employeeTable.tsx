import type { Employee } from "../../../interfaces/employee";
import EmployeeDetail from "../../mollecul/content/employee";

export interface EmployeeTableProps {
  employees: Employee[];
}

export default function EmployeeTable({ employees }: EmployeeTableProps) {
  return (
    <div className="portlet-body">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Surname</th>
            <th>Position</th>
            <th className="status-column">Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <EmployeeDetail employee={employee} key={employee._id} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
