import React, { useEffect, useState } from "react";

const StaffList = () => {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStaffs();
  }, []);

  const fetchStaffs = () => {
    fetch("http://127.0.0.1:5555/staff")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch staff data");
        }
        return res.json();
      })
      .then((data) => {
        setStaffs(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      fetch(`http://127.0.0.1:5555/staff/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to delete staff");
          }
          setStaffs((prevStaffs) => prevStaffs.filter((staff) => staff.id !== id));
        })
        .catch((err) => alert("Error: " + err.message));
    }
  };

  return (
    <div className="staff-list">
      <h2>All Staff Members</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="error-text">Error: {error}</p>}

      {!loading && !error && (
        <table className="staff-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Date Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffs.map((staff) => (
              <tr key={staff.id}>
                <td>{staff.id}</td>
                <td>{staff.full_name}</td>
                <td>{staff.email}</td>
                <td>{new Date(staff.created_at).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleDelete(staff.id)} className="delete-btn">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StaffList;
