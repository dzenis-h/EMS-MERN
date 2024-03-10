import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import notFound from "../images/404.png";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <main className="notfound-container">
      <div className="notfound-content">
        <div className="notfound-title">Oops!</div>
        <div className="notfound-subtitle">
          The page you're looking for doesn't exist.
        </div>
        <p onClick={() => navigate("/employees")} className="notfound-btn">
          Go back
        </p>
      </div>
      <div className="notfound-image-container">
        <LazyLoadImage
          src={notFound}
          alt="404 Not Found"
          className="notfound-image"
          loading="lazy"
        />
      </div>
    </main>
  );
}
