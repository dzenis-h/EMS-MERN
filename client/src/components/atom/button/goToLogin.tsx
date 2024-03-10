import { Link } from "react-router-dom";
import { ArrowLeft } from "react-feather";

export interface GoToLoginProps {
  className?: string;
}

export default function GoToLogin({ className }: GoToLoginProps) {
  return (
    <Link
      to="/login"
      className={`btn btn-hollow ${!!className ? className : ""}`}
    >
      <ArrowLeft size="18" className="button-left-icon" /> Go to the LOGIN page
    </Link>
  );
}
