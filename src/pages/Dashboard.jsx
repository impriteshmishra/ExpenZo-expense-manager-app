import React, { useEffect, useState } from "react";
import Header from "../components/Headers/indexHeader";
import Cards from "../components/Cards/Cards";
import Footer from "../components/Footers/Footers";
import AddIncomeModal from "../components/Modals/addIncome";
import AddExpenseModal from "../components/Modals/addExpenses";
import { useAuthState } from "react-firebase-hooks/auth";
import { addDoc, collection, getDoc, getDocs, query } from "firebase/firestore";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import moment from "moment";
import TransactionsTable from "../components/TransactionsTable/TransactionsTable";
import "./Dashboard.css";
import Chart from "../components/Chart/Chart";
import NoTransaction from "../components/NoTransaction/NoTransaction";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);

  const [isExpenseModalVisible, setisExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setisIncomeModalVisible] = useState(false);

  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);

  const showExpenseModal = () => {
    setisExpenseModalVisible(true);
  };
  const showIncomeModal = () => {
    setisIncomeModalVisible(true);
  };
  const handleExpenseModalCancel = () => {
    setisExpenseModalVisible(false);
  };
  const handleIncomeModalCancel = () => {
    console.log("cancel income ");

    setisIncomeModalVisible(false);
  };

  const onFinish = (value, type) => {
    const newTransaction = {
      type: type,
      date: value.date.format("YYYY-MM-DD"),
      amount: parseFloat(value.amount),
      tag: value.tag,
      name: value.name,
    };
    addTransaction(newTransaction);
  };

  async function addTransaction(transaction, many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      // console.log(("docRefuid", docRef.id))  id is transaction id
      if (!many) toast.success("Transaction added.");
      let newArr = transactions;
      newArr.push(transaction);
      setTransactions(newArr);
      calculateBalance();
      console.log("add transc function");
    } catch (error) {
      if (!many) toast.error("Error occured while adding transaction");
    }
  }

  useEffect(() => {
    // geting all docs from a collection.
    if (user) {
      fetchTransaction();
    }
  }, [user]);

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  function calculateBalance() {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transactions) => {
      if (transactions.type == "income") {
        totalIncome += transactions.amount;
      } else if (transactions.type == "expense") {
        totalExpense += transactions.amount;
      }
    });
    setIncome(totalIncome);
    setExpense(totalExpense);
    setCurrentBalance(totalIncome - totalExpense);
    console.log("Total Expense=>", totalExpense);
    console.log("Income=>", totalIncome);
    console.log("Current balance=>", currentBalance);
  }

  async function fetchTransaction() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      toast.success("Transaction fetched");
    }
    setLoading(false);
  }

  let sortedTransactions = transactions.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
  });

  return (
    <div>
      <Header />
      {loading ? (
        <p>Wait data loading...</p>
      ) : (
        <>
        <div className="container-1">
        <Cards
            income={income}
            expense={expense}
            currentBalance={currentBalance}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
          />
          {transactions.length!=0?<Chart sortedTransactions={sortedTransactions}/> : <NoTransaction/>}

        </div>
         
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeModalCancel={handleIncomeModalCancel}
            onFinish={onFinish}
          >
            Income
          </AddIncomeModal>
          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseModalCancel={handleExpenseModalCancel}
            onFinish={onFinish}
          >
            Expense
          </AddExpenseModal>
          <TransactionsTable
            transactions={transactions}
            addTransaction={addTransaction}
            fetchTransaction={fetchTransaction}
          />
        </>
      )}
      <Footer />
    </div>
  );
}

export default Dashboard;
