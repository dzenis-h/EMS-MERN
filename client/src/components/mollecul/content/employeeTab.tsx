import { useState, useContext } from "react";
import DisplayTab from "./displayTab";
import Rodal from "rodal";
import noDataPng from "../../../images/no-data-illustration.png";
import GetEmployeeForm from "../../organ/form/getEmployeeForm";
import { context } from "../../../context/tabContent";
import { getActiveEmployeeTabContent } from "../../../helpers/global";

export default function EmployeeTabContent() {
  const [open, setOpen] = useState<boolean>(false);

  const toggleOpen = () => {
    setOpen(!open);
  };

  const ctx = useContext(context);

  const displayData = getActiveEmployeeTabContent(ctx.activeTab.name, ctx);
  return (
    <>
      <div className="col-md-8">
        <div className="form-content">
          <div className="portlet portlet-boxed">
            <div className="portlet-header tab-content-portlet-header">
              <h4 className="portlet-title">{ctx.activeTab.name}</h4>
              <button
                className="btn btn-primary submit-button"
                onClick={toggleOpen}
              >
                {" "}
                Add new
              </button>
            </div>
            {!!displayData.length ? (
              <DisplayTab />
            ) : (
              <div className="portlet-body no-data__wrapper">
                <img
                  src={noDataPng}
                  alt="Missing data illustration"
                  className="no-data__image"
                />
                <p className="no-data">
                  Oops there is no data for this employee detail item! <br />
                  Please add some!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Rodal
        visible={open}
        onClose={toggleOpen}
        closeOnEsc
        customStyles={{
          height: "auto",
          bottom: "auto",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <GetEmployeeForm tabId={ctx.activeTab.id} />
      </Rodal>
    </>
  );
}
