import React, { useState, useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { useNavigate } from 'react-router-dom';

const AddTransaction = () => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState('debit');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  const { addTransaction } = useContext(TransactionContext);
  const navigate = useNavigate();

  const onSubmit = e => {
    e.preventDefault();

    const newTransaction = {
      title,
      amount: +amount,
      type,
      category,
      date: date ? new Date(date) : new Date()
    };

    addTransaction(newTransaction);
    navigate('/history');
  };

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Add New Transaction</h3>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter text..."
              className="form-control"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="amount">Amount (USD)</label>
            <input
              type="number"
              name="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount..."
              className="form-control"
              required
              min="0.01"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Transaction Type</label>
            <select
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="form-control"
            >
              <option value="debit">Expense (Debit)</option>
              <option value="credit">Income (Credit)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Food, Salary, Rent..."
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="form-control"
            />
          </div>

          <button className="btn" style={{ marginTop: '1rem' }}>Add Transaction</button>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
