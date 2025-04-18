import { useNavigate } from "react-router-dom";
import "./summarycard.css";

const SummaryCard = ({ title, value, link }) => {
  const navigate = useNavigate()
  const handleClick = (link) => navigate(`${link}`)
  return (
    <div className="summary-card">
      
      {link && (
        <div onClick={() => handleClick(`/staff${link}`)}>
          <h2>{title}</h2>
          <p>{value}</p>
        </div>
      )}
    </div>
  );
};

export default SummaryCard;