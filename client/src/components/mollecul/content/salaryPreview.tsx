import { DownloadTableExcel } from "react-export-table-to-excel";
import { useRef } from "react";

export default function SalaryPreview() {
  const tableRef = useRef<HTMLTableElement>(null);
  return (
    <div className="portlet-body portlet-body-salaries">
      <DownloadTableExcel
        filename="Salaries Total Preview"
        sheet="Total Preview"
        currentTableRef={tableRef.current}
      >
        <button
          id="salaries-total-table-xls-button"
          className="btn btn-hollow plus"
        >
          Download as XLS
        </button>
      </DownloadTableExcel>
      <table
        ref={tableRef}
        className="table table-striped table-responsive"
        id="salariesTotalTable"
      >
        <thead>
          <tr>
            <th>Total Salaries</th>
            <th>Payoneer-Hand Salaries No</th>
            <th>Bank Total</th>
            <th>Bank Contributes</th>
            <th>Payoneer Total</th>
            <th>Hand Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{/* {totalNumberOfSalaries} */}</td>
            <td>
              {/* {totalNumberOfPayoneerSalaries} - {totalNumberOfHandSalaries} */}
            </td>
            <td>{/* {totalBankSalaries} */}</td>
            <td>{/* {totalBankContributes} */}</td>
            <td>{/* {totalPayoneerSalaries} */}</td>
            <td>{/* {totalHandSalaries} */}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
