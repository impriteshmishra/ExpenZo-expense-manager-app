import React, { useState } from "react";
import { Button, Radio, Select, Table } from "antd";
import { Option } from "antd/es/mentions";
import "./style.css";
// import from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { parse, unparse } from "papaparse";
import { toast } from "react-toastify";

function TransactionsTable({
  transactions,
  addTransaction,
  fetchTransactions,
}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");

  const columns = [
    {
      title: "Name of transaction",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];
  // let filterTransaction = transactions.filter(
  //   (item) =>
  //     item.name.toLowerCase().includes(search.toLowerCase()) &&
  //     item.type.includes(typeFilter)
  // );

  let filterTransaction = transactions.filter(
    (item) =>
      item.name?.toLowerCase().includes(search.toLowerCase()) && // Ensures `name` is not undefined
      item.type?.includes(typeFilter) // Ensures `type` is not undefined
  );

  let sortedTransactions = filterTransaction.sort((a, b) => {
    if (sortKey === "date") {
      console.log("date=>", a.date, b.date);

      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "amount") {
      console.log("amount=>", a.amount, b.amount);

      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

  function exportCSV() {
    const csv = unparse(transactions, {
      fields: ["name", "type", "tag", "date", "amount"],
      transactions,
    });
    const data = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const csvURL = URL.createObjectURL(data);
    const tempLink = document.createElement("a"); // making templet out of it making anchor tag
    tempLink.href = csvURL;
    tempLink.download = "transactions.csv";
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
  }

  function importFromCsv(event) {
    event.preventDefault();
    try {
      parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          console.log(results);

          for (const transaction of results.data) {
            const newTransaction = {
              ...transaction,
              amount: parseFloat(transaction.amount),
            };
            await addTransaction(newTransaction, true);
          }
        },
      });
      toast.success("All transactions added");
      fetchTransactions();
      event.target.files = null;
    } catch (error) {
      toast.error(error.message);
    }
  }

  // function importFromCsv(event) {
  //   event.preventDefault();

  //   try {
  //     parse(event.target.files[0], {
  //       header: true,
  //       complete: async function (results) {
  //         try {
  //           for (const transaction of results.data) {
  //             const newTransaction = {
  //               ...transaction,
  //               amount: parseFloat(transaction.amount),
  //             };
  //             await addTransaction(newTransaction, true); // Assuming addTransaction is an async function
  //           }
  //           toast.success("All transactions added");
  //           fetchTransactions(); // Fetch after all transactions are added
  //         } catch (error) {
  //           toast.error("Error adding transactions: " + error.message);
  //         }
  //       },
  //     });

  //     // Reset the file input
  //     event.target.value = '';

  //   } catch (error) {
  //     toast.error("Error parsing CSV: " + error.message);
  //   }
  // }

  return (
    <>
      <div className="search-panel">
        <div className="input">
          <CiSearch />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Search transaction"
          />
        </div>

        <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>
      <div className="sort-import-export">
        <div className="sort-panel">
          <p>All transaction</p>
          <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">NO Sort</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>
        </div>
        <div className="import-export">
          <button className="button" onClick={exportCSV}>
            Export to CSV
          </button>
          <label className="button" for="file-csv">
            Import from CSV
          </label>
          <input
            id="file-csv"
            type="file"
            accept=".csv"
            required
            onChange={importFromCsv}
            style={{ display: "none" }}
          />
        </div>
      </div>

      <Table
        className="table"
        dataSource={sortedTransactions}
        columns={columns}
      />
    </>
  );
}

export default TransactionsTable;
