import { months } from "../../../constant/month";
import { context } from "../../../context/tabContent";
import {
  getActiveEmployeeTabContent,
  getActiveEmployeeTabFunc,
} from "../../../helpers/global";
import { useContext } from "react";
import { useParams } from "react-router-dom";

export default function DisplayTab() {
  const { identifier } = useParams();
  const ctx = useContext(context);
  const items = getActiveEmployeeTabContent(ctx.activeTab.name, ctx);
  const func = getActiveEmployeeTabFunc(ctx.activeTab.name);

  return (
    <div className="portlet-body">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Description</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => {
            const date = new Date(item.date);
            return (
              <tr key={idx}>
                <td className="col-md-4">
                  {date.getDate()}-{months[date.getMonth()].label}-
                  {date.getFullYear()}
                </td>
                <td className="col-md-2">
                  {item.amount} {item.unit}
                </td>
                <td className="col-md-5">{item.description || "N/A"}</td>
                <td className="col-md-1">
                  {func !== null && (
                    <button
                      className="btn"
                      onClick={() => {
                        func(identifier as string, item._id);
                        if (ctx.activeTab.name === "Bonuses")
                          ctx.setDisplayData((prev) => ({
                            ...prev,
                            bonuses: prev.bonuses.filter(
                              (el) => el._id !== item._id
                            ),
                          }));

                        if (ctx.activeTab.name === "Penalties")
                          ctx.setDisplayData((prev) => ({
                            ...prev,
                            penalties: prev.penalties.filter(
                              (el) => el._id !== item._id
                            ),
                          }));
                      }}
                    >
                      <span className="fa fa-times icon-pointer"></span>
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
