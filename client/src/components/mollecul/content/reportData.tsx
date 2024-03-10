import type { SummaryData } from "../../../interfaces/report";
import { Activity } from "react-feather";
import { Link } from "react-router-dom";

export interface ReportDataProps {
  data: SummaryData;
}

export default function ReportData({ data }: ReportDataProps) {
  return (
    <tr>
      <td>{data.year}</td>
      <td>{data.month}</td>
      <td>{data.net}</td>
      <td>{data.gross}</td>
      <td>{data.penalties}</td>
      <td>{data.bonuses}</td>
      <td>{data.tax}</td>
      <td>{data.salary}</td>
      <td className="table-actions">
        <Link
          to={{
            pathname: `/reports/details`,
            search: `month=${data.month}&year=${data.year}`,
          }}
        >
          <Activity size="20" />
        </Link>
      </td>
    </tr>
  );
}
