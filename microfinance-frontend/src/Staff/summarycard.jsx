import { Link } from "react-router-dom";
import "./summarycard.css";

const SummaryCard = ({ title, value, link }) => {
  return (
    <div className="summary-card">
      <h2>{title}</h2>
      <p>{value}</p>
      {link && (
        <Link to={`/staff${link}`}>
          Go to {title}
        </Link>
      )}
    </div>
  );
};

export default SummaryCard;