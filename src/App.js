import React, { useState ,useEffect } from "react";
import "./App.css";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Alert from "./components/Alert";
import { v4 as uuidv4 } from "uuid";

// All Expenses
const initialExpenses = localStorage.getItem("expenses")
  ? JSON.parse(localStorage.getItem("expenses"))
  : [];

function App() {
  // state values

  // All expenses, add expenses
  const [expenses, setExpenses] = useState(initialExpenses);

  // Single expense
  const [charge, setCharge] = useState("");

  // Single amount
  const [amount, setAmount] = useState("");

  // Alert
  const [alert, setAlert] = useState({ show: false });

  // Edit
  const [edit, setEdit] = useState(false);

  // Id
  const [id, setId] = useState(0);

  // useEffect
  useEffect(()=>{
    console.log("we called useEffect");
    localStorage.setItem('expenses', JSON.stringify(expenses))
  },[expenses]);

  // Functionality
  // handle charge
  const handleCharge = (e) => {
    setCharge(e.target.value);
  };

  // handle Amount
  const handleAmount = (e) => {
    setAmount(e.target.value);
  };

  // handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (charge !== "" && amount > 0) {
      if (edit) {
        let tempExpenses = expenses.map((item) => {
          return item.id === id ? { ...item, charge, amount } : item;
        });
        setExpenses(tempExpenses);
        setEdit(false);
        handleAlert({ type: "success", text: "Item Edited Successfully" });
      } else {
        const singleExpense = { id: uuidv4(), charge, amount };
        setExpenses([...expenses, singleExpense]);
        handleAlert({ type: "success", text: "Item Added Successfully" });
      }
      setCharge("");
      setAmount("");
    } else {
      handleAlert({ type: "danger", text: "Please Enter Valid Values" });
    }
  };

  // handle Alert
  const handleAlert = ({ type, text }) => {
    setAlert({ show: true, type, text });
    setTimeout(() => {
      setAlert({ show: false });
    }, 1000);
  };

  // Clear all items
  const clearItems = () => {
    setExpenses([]);
    handleAlert({ type: "danger", text: "All Items Deleted" });
  };

  // Handle Delete
  const handleDelete = (id) => {
    let tempExpenses = expenses.filter((item) => item.id !== id);
    setExpenses(tempExpenses);
    handleAlert({ type: "danger", text: "Item Deleted" });
  };

  // Handle Edit
  const handleEdit = (id) => {
    let expense = expenses.find((item) => item.id === id);
    let { charge, amount } = expense;
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setId(id);
  };

  return (
    <>
      {alert.show && <Alert type={alert.type} text={alert.text} />}
      <Alert />
      <h1>Budget Calculator</h1>
      <main className="App">
        <ExpenseForm
          charge={charge}
          amount={amount}
          handleAmount={handleAmount}
          handleCharge={handleCharge}
          handleSubmit={handleSubmit}
          edit={edit}
        />
        <ExpenseList
          expenses={expenses}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          clearItems={clearItems}
        />
      </main>
      <h1>
        Total Spending:{" "}
        <span className="total">
          Rs.
          {expenses.reduce((acc, curr) => {
            return (acc += parseInt(curr.amount));
          }, 0)}
        </span>
      </h1>
    </>
  );
}

export default App;
