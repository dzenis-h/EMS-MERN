import AddEmployeeForm from "../../organ/form/addEmployee";

export default function AddEmployeePanel() {
  return (
    <div className="col-md-5">
      <div className="portlet portlet-boxed">
        <div className="portlet-header">
          <h4 className="portlet-title">Add new employee</h4>
        </div>
        <div className="portlet-body">
          <div id="settings-content" className="stacked-content">
            <div className="tab-pane in active" id="profile-tab">
              <AddEmployeeForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
