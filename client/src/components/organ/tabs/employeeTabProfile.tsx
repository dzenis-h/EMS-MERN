import EmployeeTabs from "../../atom/tabs/employeeTabs";
import EmployeeTabContent from "../../mollecul/content/employeeTab";

export default function EmployeeTabsProfile() {
  return (
    <>
      <div className="col-md-4">
        <div className="list-group">
          <EmployeeTabs />
        </div>
      </div>
      <EmployeeTabContent />
    </>
  );
}
