import React, { createContext, useReducer } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
  transactions: [],
  error: null,
  loading: true
};

export const TransactionContext = createContext(initialState);

const transactionReducer = (state, action) => {
  switch (action.type) {
    case 'GET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload,
        loading: false
      };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
        loading: false
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t._id !== action.payload),
        loading: false
      };
    case 'TRANSACTION_ERROR':
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};

export const TransactionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  // Get Transactions
  const getTransactions = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/transactions`);
      dispatch({ type: 'GET_TRANSACTIONS', payload: res.data });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response ? err.response.data.msg : 'Error fetching transactions'
      });
    }
  };

  // Add Transaction
  const addTransaction = async (transaction) => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    try {
      const res = await axios.post(`${API_URL}/api/transactions`, transaction, config);
      dispatch({ type: 'ADD_TRANSACTION', payload: res.data });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response ? err.response.data.msg : 'Error adding transaction'
      });
    }
  };

  // Delete Transaction
  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/transactions/${id}`);
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    } catch (err) {
      dispatch({
        type: 'TRANSACTION_ERROR',
        payload: err.response ? err.response.data.msg : 'Error deleting transaction'
      });
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions: state.transactions,
        error: state.error,
        loading: state.loading,
        getTransactions,
        addTransaction,
        deleteTransaction
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};