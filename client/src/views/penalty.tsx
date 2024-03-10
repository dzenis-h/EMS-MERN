import { ToastContainer } from "react-toastify";
import NoPenaltyData from "../components/atom/content/noPenaltyData";
import MultiplePenaltyForm from "../components/organ/form/multiplePenaltyForm";
import PenaltyTable from "../components/mollecul/content/penaltyTable";
import { useContext } from "react";
import { context } from "../context/penaltyContext";

export default function PenaltyPage() {
  const { penaltyForms } = useContext(context);
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-4">
          <div className="portlet portlet-boxed">
            <div className="portlet-header">
              <h4 className="portlet-title">Enter multiple penalties</h4>
            </div>
            <MultiplePenaltyForm />
          </div>
        </div>
        <div className="col-md-8">
          <div className="portlet portlet-boxed">
            <div className="portlet-header">
              <h4 className="portlet-title">Add new penalties overview</h4>
            </div>
            {!!penaltyForms.length ? (
              <div className="portlet-body penalties__wrapper">
                <PenaltyTable />
              </div>
            ) : (
              <NoPenaltyData />
            )}
          </div>
        </div>
      </div>
      <ToastContainer autoClose={3000} closeOnClick />
    </div>
  );
}
