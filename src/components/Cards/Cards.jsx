import React from "react";
import "./style.css";
import { Card, Row } from "antd";
import Button from "../Button/Button";
function Cards({
  currentBalance,
  expense,
  income,
  showExpenseModal,
  showIncomeModal,
}) {
  return (
    <div>
      <Row className="my-row">
        <Card className="my-card" title="Current Balance">
          <p>₹{currentBalance}</p>
          <Button className="button" text="Reset Balance" />
        </Card>
        <Card className="my-card" title="Total Income">
          <p>₹{income}</p>
          <Button text="Add Income" onClick={showIncomeModal} />
        </Card>
        <Card className="my-card" title="Total Expenses">
          <p>₹{expense}</p>
          <Button text="Add Expenses" onClick={showExpenseModal} />
        </Card>
      </Row>
    </div>
  );
}

export default Cards;
