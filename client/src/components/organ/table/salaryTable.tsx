import { DownloadTableExcel } from "react-export-table-to-excel";
import { useRef, useContext } from "react";
import { context } from "../../../context/salaryContext";
import SalaryPreviewData from "../../mollecul/content/salaryPreviewData";

export default function SalaryTable() {
  const tableRef = useRef<HTMLTableElement>(null);
  const { datas } = useContext(context);

  return (
    <div className="portlet portlet-boxed">
      <div className="portlet-body portlet-body-salaries">
        <DownloadTableExcel
          filename="Salaries"
          sheet="Preview"
          currentTableRef={tableRef.current}
        >
          <button className="btn btn-hollow plus">Download as XLS</button>
        </DownloadTableExcel>
        <table
          className="table table-striped mt-20"
          id="salariesTable"
          ref={tableRef}
        >
          <thead>
            <tr>
              <th className="salaries-table__first-col salaries-table__decoration">
                Full name
              </th>
              <th>Total Net Salary</th>
              <th className="salaries-table__decoration">Total Gross Salary</th>
              <th>Hand Tax</th>
              <th>Hand Bonus</th>
              <th>Hand Penalty</th>
              <th className="salaries-table__decoration">Hand Total</th>
              <th>Loan</th>
              <th>Installment</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {datas.map((el, idx) => (
              <SalaryPreviewData item={el} key={idx} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
