import AddEmployeePanel from "../../components/mollecul/content/addEmployeePanel";
import EmployeeTable from "../../components/organ/table/employeeTable";
import { useSelector, useDispatch } from "react-redux";
import type { RootReducer } from "../../store";
import type { EmployeeState } from "../../reducer/employee";
import { useEffect } from "react";
import { getListEmployee } from "../../actions/employee";

export default function Employee() {
  const dispatch = useDispatch();
  const { employees } = useSelector<RootReducer, EmployeeState>(
    ({ employeeReducer }) => employeeReducer
  );

  useEffect(() => {
    if (!employees.length) dispatch<any>(getListEmployee({ page: 1 }));
  }, [employees.length]);

  return (
    <div className="container">
      <div className="row">
        <AddEmployeePanel />
        <div className="col-md-7">
          <div className="portlet portlet-boxed">
            <div className="portlet-header">
              <h4 className="portlet-title">Employees</h4>
            </div>
            <EmployeeTable employees={employees} />
          </div>
        </div>
      </div>
    </div>
  );
}
