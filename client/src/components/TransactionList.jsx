import React, { useContext, useEffect } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { Trash2 } from 'lucide-react';

const TransactionList = () => {
  const { transactions, getTransactions, deleteTransaction } = useContext(TransactionContext);

  useEffect(() => {
    getTransactions();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div className="card">
        <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Transaction History</h3>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t._id}>
                  <td>{new Date(t.date).toLocaleDateString()}</td>
                  <td>{t.title}</td>
                  <td>{t.category}</td>
                  <td className={t.type === 'credit' ? 'text-success' : 'text-danger'} style={{ fontWeight: '600' }}>
                    {t.type === 'credit' ? '+' : '-'}${t.amount}
                  </td>
                  <td>
                    <button 
                      onClick={() => deleteTransaction(t._id)}
                      style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        color: 'var(--danger)', 
                        cursor: 'pointer',
                        padding: '4px' 
                      }}
                      title="Delete Transaction"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                   <td colSpan="5" style={{textAlign: 'center', color: 'var(--text-muted)'}}>No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
