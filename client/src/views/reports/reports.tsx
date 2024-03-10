import ReportData from "../../components/mollecul/content/reportData";
import { useState, useEffect, useRef } from "react";
import type { SummaryData } from "../../interfaces/report";
import { getSummaryData } from "../../actions/report";
import { DownloadTableExcel } from "react-export-table-to-excel";

export default function ReportPage() {
  const [data, setData] = useState<SummaryData[]>([]);
  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    if (!data.length)
      (async () => {
        setData(await getSummaryData());
      })();
  }, [data.length]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="portlet portlet-boxed">
            <div className="portlet-header">
              <h4>
                List of all reports <br />
              </h4>
              <p className="portlet-title">
                <span style={{ color: "#48C6EF" }}>
                  Details available by clicking on an icon
                </span>
              </p>
            </div>

            <div className="portlet-body" style={{ marginTop: "20px" }}>
              <DownloadTableExcel
                filename="Salaries"
                sheet="Preview"
                currentTableRef={tableRef.current}
              >
                <p className="portlet-title" style={{ cursor: "pointer" }}>
                  <span style={{ color: "#48C6EF" }}>Download as XLS</span>
                </p>
              </DownloadTableExcel>
              <table className="table table-striped" ref={tableRef}>
                <thead>
                  <tr>
                    <th>YEAR</th>
                    <th>MONTH</th>
                    <th>NET</th>
                    <th>GROSS</th>
                    <th>PENALTIES</th>
                    <th>BONUSES</th>
                    <th>TAXES</th>
                    <th>SALARY</th>
                    <th>DETAIL</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((el) => (
                    <ReportData key={`${el.year}-${el.month}`} data={el} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
