import type { Employee } from "../../../interfaces/employee";
import { Link } from "react-router-dom";
import SetStatusEmployeeBtn from "../../atom/button/setStatusBtn";

export interface EmployeeDetailProps {
  employee: Employee;
}

export default function EmployeeDetail({ employee }: EmployeeDetailProps) {
  return (
    <tr>
      <td>
        <Link to={`/employees/${employee._id}`}> {employee.name} </Link>{" "}
      </td>
      <td>{employee.surname}</td>
      <td>{employee.position}</td>
      <td className="status-column">
        <i
          className={`fa fa-circle ${
            !employee.enddate ? "employeeactive" : "employeeinactive"
          }`}
        ></i>
      </td>
      <td>
        <SetStatusEmployeeBtn
          id={employee._id}
          active={employee.enddate === undefined || employee.enddate === null}
        />
      </td>
    </tr>
  );
}
