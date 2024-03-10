import Rodal from "rodal";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import MultipleLoanForm from "../components/organ/form/multipleLoanForm";
import LoanTitle from "../components/mollecul/content/loanTitle";
import { PlusCircle } from "react-feather";
import NoLoanData from "../components/atom/content/noLoanData";
import type { RootReducer } from "../store";
import type { LoanState } from "../reducer/loan";
import { getEmployeeLoan } from "../actions/loan";
import { ToastContainer } from "react-toastify";
import SummaryLoanTable from "../components/organ/table/summaryLoan";
import ActiveLoan from "../components/organ/table/activeLoan";

export default function LoanPage() {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState<boolean>(false);

  const { totalData } = useSelector<RootReducer, LoanState>(
    ({ loanReducer }) => loanReducer
  );

  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  useEffect(() => {
    if (!totalData) dispatch<any>(getEmployeeLoan({ page: 1 }));
  }, [totalData]);

  return (
    <div className="container">
      <div className="row">
        <div className="row">
          <div className="col-md-4">
            <div className="portlet portlet-boxed">
              <div className="portlet-header">
                <h4 className="portlet-title">Enter multiple loans</h4>
              </div>
              <MultipleLoanForm />
            </div>
          </div>
          <div className="col-md-8">
            <div className="portlet portlet-boxed">
              <LoanTitle dataLength={totalData} />

              {!!totalData ? (
                <div className="portlet-body">
                  <div>
                    <h6 style={{ color: "#48C6EF", float: "right" }}>
                      Loans summary &nbsp;&nbsp;
                      <PlusCircle
                        style={{ cursor: "pointer" }}
                        size="20"
                        onClick={toggleModal}
                      />
                    </h6>
                  </div>
                  <ActiveLoan />
                </div>
              ) : (
                <NoLoanData />
              )}
            </div>
          </div>
        </div>
      </div>

      <Rodal
        visible={openModal}
        onClose={toggleModal}
        closeOnEsc={true}
        customStyles={{
          height: "auto",
          bottom: "auto",
          top: "50%",
          transform: "translateY(-50%)",
          width: "fit-content",
        }}
      >
        <SummaryLoanTable />
      </Rodal>

      <ToastContainer autoClose={3000} closeOnClick />
    </div>
  );
}
