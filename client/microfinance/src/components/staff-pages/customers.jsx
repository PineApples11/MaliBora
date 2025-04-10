import React, { useEffect, useState } from "react";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCustomerId, setExpandedCustomerId] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5555/customer");
        if (!res.ok) throw new Error("Failed to fetch customers");
        const data = await res.json();
        setCustomers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleToggleDetails = (id) => {
    setExpandedCustomerId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Customer Management</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">Full Name</th>
                <th className="py-2 px-4 border-b text-left">National ID</th>
                <th className="py-2 px-4 border-b text-left">Phone</th>
                <th className="py-2 px-4 border-b text-left">Savings Balance</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cust) => (
                <React.Fragment key={cust.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{cust.full_name}</td>
                    <td className="py-2 px-4 border-b">{cust.national_id}</td>
                    <td className="py-2 px-4 border-b">+254 {cust.phone}</td>
                    <td className="py-2 px-4 border-b">KSH {cust.savings_balance.toLocaleString()}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleToggleDetails(cust.id)}
                        className="text-blue-600 hover:underline"
                      >
                        {expandedCustomerId === cust.id ? "Hide" : "View"}
                      </button>
                    </td>
                  </tr>

                  {expandedCustomerId === cust.id && (
                    <tr className="bg-gray-50">
                      <td colSpan="5" className="py-3 px-4 border-b">
                        <div className="space-y-1 text-sm text-gray-700">
                          <p><strong>Customer ID:</strong> {cust.id}</p>
                          <p><strong>Created At:</strong> {new Date(cust.created_at).toLocaleString()}</p>
                          {/* You can add assigned staff, loans, savings history here later */}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Customers;
