import {
  GoogleLogin,
  GoogleOAuthProvider,
  type CredentialResponse,
} from "@react-oauth/google";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { useState } from "react";
import { swalError } from "../../../helpers/swal";
import { googleLogin } from "../../../actions/user";
import { useNavigate } from "react-router-dom";

export default function GoogleLoginButton() {
  const navigate = useNavigate();
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID as string;
  const [loading, setLoading] = useState<boolean>(false);

  const onSuccess = ({ credential }: CredentialResponse) => {
    setLoading(true);
    if (!credential) {
      setLoading(false);
      swalError("Something went wrong");
      return;
    }

    googleLogin(credential)
      .then((val) => {
        localStorage.setItem("access_token", val);
        navigate("/employees");
      })
      .catch((err) => {
        swalError(err?.message || "Internal Server Error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onError = () => {
    swalError("something went wrong");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <LoadingOverlayWrapper spinner text="...loading" active={loading}>
        <GoogleLogin
          text="signin_with"
          onSuccess={onSuccess}
          onError={onError}
          width="300"
        />
      </LoadingOverlayWrapper>
    </GoogleOAuthProvider>
  );
}
