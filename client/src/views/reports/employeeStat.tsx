import { ArrowLeft } from "react-feather";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import type { EmployeeSalaryDetailPerMonth } from "../../interfaces/report";
import { getSummaryDetailPerEmployee } from "../../actions/report";
import ReportEmployeeSalary from "../../components/mollecul/content/reportEmployeeSalary";

export default function EmployeeStat() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams() as Record<string, string>;
  const [data, setData] = useState<EmployeeSalaryDetailPerMonth[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const query = new URLSearchParams(location.search);
  const month = Number(query.get("month"));
  const year = Number(query.get("year")); //<- if query == null then value will be 0

  useEffect(() => {
    if (!month || !year) {
      navigate(`/reports/details?err=${"invalid params"}`);
      return;
    }

    if (!data.length) {
      setLoading(true);
      getSummaryDetailPerEmployee(id, month, year)
        .then((val) => {
          if (!val.length) {
            navigate(`/reports/details?err=${"data not found"}`);
            return;
          }
          setData(val);
        })
        .catch((err: Error) => {
          navigate(
            `/reports/details?err=${err?.message || "Internal Server Error"}`
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [data.length, id, month, year]);

  return (
    <div className="container">
      <div className="row navigation-row-2">
        <Link
          to={`/reports/details?month=${month}&year=${year}`}
          className="btn btn-hollow"
        >
          <ArrowLeft size="18" className="button-left-icon" /> Go back to
          Details
        </Link>
      </div>

      {!loading && (
        <>
          <header style={{ textAlign: "center" }}>
            <h4>
              {" "}
              <span style={{ color: "#48C6EF", fontStyle: "italic" }}>
                {" "}
                {!!data.length && data[0]?.surname}
              </span>{" "}
              detailed payment info{" "}
            </h4>
          </header>

          <div className="col-md-12" style={{ textAlign: "center" }}>
            <div className="portlet-body2">
              <table className="table table-striped auto-index">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>NET</th>
                    <th>GROSS</th>
                    <th>PENALTIES</th>
                    <th>BONUSES</th>
                    <th>TAXES</th>
                    <th>SALARY</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((el, idx) => (
                    <ReportEmployeeSalary key={el._id} data={el} idx={idx} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <hr />
        </>
      )}
    </div>
  );
}
