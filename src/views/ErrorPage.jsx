import { Link, useRouteError } from "react-router-dom";
import "../styles/error.css";

function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="error-page-container">
      <div>Oops!</div>
      <div>Sorry, an unexpected error has occurred.</div>
      <div className="error-status">
        <div>{error.statusText || error.message}</div>
      </div>
      <Link to="/home" className="error-home-link">
        Back To Home
      </Link>
    </div>
  );
}

export default ErrorPage;