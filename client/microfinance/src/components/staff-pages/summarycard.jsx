// src/components/SummaryCard.jsx
import React from "react";

const SummaryCard = ({ title, value }) => {
  return (
    <div className="bg-white shadow rounded-2xl p-4 border hover:shadow-md transition">
      <h2 className="text-sm font-medium text-gray-600">{title}</h2>
      <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
  );
};

export default SummaryCard;
