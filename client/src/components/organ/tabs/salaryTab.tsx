import { type MouseEventHandler, useContext, useState } from "react";
import { context } from "../../../context/salaryContext";
import Tabs from "../../atom/tabs/salaryTabs";
import { getActiveSalaryTabContent } from "../../../helpers/global";
import SalaryUnitDetail from "../../mollecul/content/salaryUnitDetailContent";
import { releaseSalary } from "../../../actions/salary";
import { swalConfirm, swalError, swalSuccess } from "../../../helpers/swal";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { useDispatch } from "react-redux";

export default function SalaryTabs() {
  const dispatch = useDispatch();
  const { activeTab, datas, setDisplayData, generatedDate, isRepeated } =
    useContext(context);
  const data = getActiveSalaryTabContent(activeTab.name, datas, generatedDate);
  const [loading, setLoading] = useState<boolean>(false);

  const submitSalary: MouseEventHandler = async (e) => {
    e.preventDefault();

    if (isRepeated) {
      const { isDenied, isDismissed } = await swalConfirm(
        "This month's salary payment has been paid,want to continue this payment?"
      );
      if (isDenied || isDismissed) {
        swalError("Canceled");
        return;
      }
    }

    setLoading(true);
    dispatch<any>(releaseSalary(datas, generatedDate))
      .then((val: string) => {
        swalSuccess(val);
        setDisplayData((prev) => ({
          ...prev,
          datas: [],
          signature: "",
          step: "Generate",
        }));
      })
      .catch((err: Error) => {
        swalError(err?.message || "Internal Server Error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="portlet portlet-boxed">
      <div className="portlet-body portlet-body-salaries">
        <ul id="myTab1" className="nav nav-tabs">
          <Tabs />
        </ul>
        <div id="myTab1Content">
          <div className="tab-pane active in">
            <LoadingOverlayWrapper spinner active={loading}>
              <button
                className="btn btn-primary ml-20"
                disabled={loading}
                onClick={submitSalary}>
                <span>Confirm Salary</span>
              </button>
            </LoadingOverlayWrapper>
            <table className="table table-striped mt-20">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.map((el, idx) => (
                  <SalaryUnitDetail data={el} key={idx} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
