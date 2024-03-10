import { XCircle, CheckCircle } from "react-feather";
import { type MouseEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { swalConfirm, swalError, swalSuccess } from "../../../helpers/swal";
import {
  activatedAnEmployee,
  inactiveEmployee,
} from "../../../actions/employee";

export interface SetStatusEmployeeBtnProps {
  active: boolean;
  id: string;
}

export default function SetStatusEmployeeBtn({
  active,
  id,
}: SetStatusEmployeeBtnProps) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const onClick = (e: MouseEvent) => {
    swalConfirm(
      active ? "Set the employee as inactive?" : "Set the employee as active?"
    ).then(({ isConfirmed, isDismissed, isDenied }) => {
      switch (true) {
        case isConfirmed:
          setLoading(true);
          active
          ? dispatch<any>(inactiveEmployee(id))
                .then((val: string) => {
                  swalSuccess(val);
                })
                .catch((err: Error) => {
                  swalError(err?.message || "Internal Server Error");
                })
                .finally(() => {
                  setLoading(false);
                })
            : dispatch<any>(activatedAnEmployee(id))
                .then((val: string) => {
                  swalSuccess(val);
                })
                .catch((err: Error) => {
                  swalError(err?.message || "Internal Server Error");
                })
                .finally(() => {
                  setLoading(false);
                });

          break;
        case isDenied:
        case isDismissed:
          swalError("Canceled");
          break;
        default:
          break;
      }
    });
  };

  return (
    <button
      disabled={loading}
      className="table-actions btn"
      style={{ cursor: "pointer" }}
      onClick={onClick}>
      {active ? <CheckCircle size="18" color="lime" /> : <XCircle size="18" />}
    </button>
  );
}
