import { useEffect } from 'react';
import { Link, useRouteError } from 'react-router-dom';
import '../styles/error.css';

export const ErrorPage = () => {
  const error = useRouteError();

  console.error(error);

  useEffect(() => {
    document.title = "error · stellr";
  }, []);

  return (
    <div className="error-page-container">
      <div>Oops!</div>
      <div>Sorry, an unexpected error has occurred.</div>

      <div className="error-page-status">
        <div className="error-page-message">
          {error?.statusText || error?.message || "Unknown error occurred."}
        </div>
      </div>

      <Link to="/home" className="error-page-link">
        Back to Home
      </Link>
    </div>
  );
};

export default ErrorPage;
