import "../../styles/common.css";

export const ErrorMessage = ({ message, onRetry }) => (
  <div className="error-container">
    <div>{message}</div>
    {onRetry && <button onClick={onRetry}>Retry</button>}
  </div>
);

export default ErrorMessage;