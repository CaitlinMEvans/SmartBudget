import React from "react";

function Dashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Account Summary</h2>

      {/* Cards row */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px", flexWrap: "wrap" }}>
        <div style={cardStyle}>
          <h3>Available Balance</h3>
          <p>$0.00</p>
        </div>
        <div style={cardStyle}>
          <h3>Pending Balance</h3>
          <p>$0.00</p>
        </div>
        <div style={cardStyle}>
          <h3>Spending This Month</h3>
          <p>$0.00</p>
        </div>
      </div>

      {/* Chart placeholder */}
      <div style={{ marginTop: "40px", padding: "20px", border: "1px dashed #ccc", borderRadius: "8px" }}>
        <h3>Monthly Spending Chart</h3>
        <p>(Chart will go here)</p>
      </div>
    </div>
  );
}

const cardStyle = {
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  flex: "1",
  minWidth: "200px",
  background: "#f9f9f9",
  textAlign: "center",
};

export default Dashboard;

