import type { MouseEventHandler } from "react";
import { months } from "../../../constant/month";
import SalaryTable from "../table/salaryTable";
import { ArrowRightCircle } from "react-feather";

export interface PreviewSalaryPageProps {
  handler: MouseEventHandler;
  date: Date;
}

export default function PreviewSalaryPage({
  handler,
  date,
}: PreviewSalaryPageProps) {
  return (
    <div className="portlet portlet-boxed">
      <div className="portlet-header tab-content-portlet-header portlet-salaries">
        <h4 className="portlet-title">
          {months[date.getMonth()].label} - {date.getFullYear()}
        </h4>
        <button
          type="button"
          className="btn btn-primary btn-salaries"
          onClick={handler}
        >
          <ArrowRightCircle size="18" />
        </button>
      </div>
      <SalaryTable />
    </div>
  );
}
