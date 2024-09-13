import { Line, Pie } from "@ant-design/charts";
import React from "react";
import { getAnalytics } from "firebase/analytics";
import "./style.css";

function Chart({ sortedTransactions }) {
  const data = sortedTransactions.map((item) => {
    return { date: item.date, amount: item.amount };
  });

  let spendingData = sortedTransactions.filter((transaction) => {
    if (transaction.type == "expense") {
      return { tag: transaction.tag, amount: transaction.amount };
    }
  });

  let finalSpendings = spendingData.reduce((acc, obj) => {
    let key = obj.tag;
    if (!acc[key]) {
      acc[key] = { tag: obj.tag, amount: obj.amount };
    } else {
      acc[key].amount += obj.amount;
    }
    return acc;
  }, {});

  const config = {
    data: data,
    // width: 800,
    autoFit: false,
    xField: "date",
    yField: "amount",
  };
  const spendingConfig = {
    data: Object.values(finalSpendings),
    // data:spendingData,  // due to this the pie chart are not consistent
    // width: 500,
    autoFit: true,
    angleField: "amount",
    colorField: "tag",
  };

  let chart;
  let pieChart;

  return (
    <div className="charts-wrapper">
      <div className="line-chart">
        <h2>Analytics</h2>
        <Line
          {...config}
          onReady={(chartInstance) => (chart = chartInstance)}
        />
      </div>
      <div className="pie-chart-container">
        {Object.values(finalSpendings).length>0 ? (
          <Pie
            className="pie-chart"
            {...spendingConfig}
            onReady={(chartInstance) => (pieChart = chartInstance)}
          />
        ) : (
          <h2>Expense not available</h2>
        )}
      </div>
    </div>
  );
}
export default Chart;
