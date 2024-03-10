import logo from "../images/logo.png";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import GoogleLoginButton from "../components/mollecul/form/googleLoginForm";

export default function LoginPage() {
  const [mount, setMount] = useState<boolean>(false);

  useEffect(() => {
    setMount(true);
  }, []);

  return (
    <div className="container w-100">
      <div className="container container__login">
        <div className="login__section">
          <img
            src={logo}
            alt="EMS Mars logo"
            className="login__section__logo"
          />
          <h4>Welcome to Mars EMS! </h4>
          <p className="no-data" style={{ marginBottom: "-.25rem" }}>
            Sign in with your credentials
          </p>
          <br />
          <br />
          {mount && <GoogleLoginButton />}
          <div className="intro">
            <ul>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms">Terms And Conditions</Link>
              </li>
              <li style={{ marginTop: ".6rem" }}>Made by Balkan Dreaams™️ test</li>
              <li>&copy; {new Date().getFullYear()}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
