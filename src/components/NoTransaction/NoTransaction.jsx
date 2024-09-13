import React from 'react';
import transactions from "../../assets/!chart.jpg";

function NoTransaction() {
  return (
    
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        flexDirection: "column",
      }}
    >
      <img src={transactions} style={{ width: "400px", margin: "4rem" }} />
      <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
        Transaction not available.
      </p>
    </div>
  )
}

export default NoTransaction
