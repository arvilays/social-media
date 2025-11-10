import "../../styles/common.css";

export const LoadingMessage = ({ message = "Loading..." }) => (
  <div className="loading-container">{message}</div>
);

export default LoadingMessage;