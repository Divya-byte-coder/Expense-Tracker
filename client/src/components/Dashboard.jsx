import React, { useContext, useEffect } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { AuthContext } from '../context/AuthContext';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { transactions, getTransactions } = useContext(TransactionContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    getTransactions();
    // eslint-disable-next-line
  }, []);

  const amounts = transactions.map(transaction => ({
    amount: transaction.amount,
    type: transaction.type
  }));

  const income = amounts
    .filter(item => item.type === 'credit')
    .reduce((acc, item) => (acc += item.amount), 0)
    .toFixed(2);

  const expense = amounts
    .filter(item => item.type === 'debit')
    .reduce((acc, item) => (acc += item.amount), 0)
    .toFixed(2);

  const total = (income - expense).toFixed(2);

  const data = {
    labels: ['Income', 'Expense'],
    datasets: [
      {
        data: [income, expense],
        backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(239, 68, 68, 0.8)'],
        borderColor: ['rgba(16, 185, 129, 1)', 'rgba(239, 68, 68, 1)'],
        borderWidth: 1,
      },
    ],
  };

  // Group expenses by month
  const monthlyExpenses = transactions
    .filter(t => t.type === 'debit')
    .reduce((acc, t) => {
      const date = new Date(t.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      if (!acc[monthYear]) acc[monthYear] = 0;
      acc[monthYear] += t.amount;
      return acc;
    }, {});

  const barData = {
    labels: Object.keys(monthlyExpenses),
    datasets: [
      {
        label: 'Monthly Expenses',
        data: Object.values(monthlyExpenses),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      }
    ]
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { ticks: { color: 'var(--text-muted)' } },
      y: { ticks: { color: 'var(--text-muted)' } }
    }
  };

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#f8fafc'
        }
      }
    }
  };

  // Export as CSV
  const exportCSV = () => {
    const csv = Papa.unparse(transactions.map(t => ({
      Title: t.title,
      Amount: t.amount,
      Type: t.type,
      Category: t.category,
      Date: new Date(t.date).toLocaleDateString()
    })));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'expenses.csv';
    link.click();
  };

  // Export as PDF
  const exportPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Expense Report', 14, 18);

  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 26);
  doc.text(`Total Balance: $${total}  |  Income: $${income}  |  Expenses: $${expense}`, 14, 33);

  const tableColumn = ['Date', 'Title', 'Category', 'Type', 'Amount'];

  const tableRows = transactions.map(t => [
    new Date(t.date).toLocaleDateString(),
    t.title,
    t.category,
    t.type === 'credit' ? 'Income' : 'Expense',
    `$${t.amount}`
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [99, 102, 241] }
  });

  doc.save('expense-report.pdf');
};

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: 'var(--text-main)' }}>Hello, {user && user.name}</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={exportCSV} className="btn" style={{ padding: '0.5rem 1rem', width: 'auto' }}>
            Export CSV
          </button>
          <button onClick={exportPDF} className="btn" style={{ padding: '0.5rem 1rem', width: 'auto', background: 'var(--danger)' }}>
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3">
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h4 style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>Current Balance</h4>
          <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem' }}>${total}</h1>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h4 style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>Income</h4>
          <p className="text-success" style={{ fontSize: '2rem', fontWeight: '600', marginTop: '0.5rem' }}>+${income}</p>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h4 style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>Expense</h4>
          <p className="text-danger" style={{ fontSize: '2rem', fontWeight: '600', marginTop: '0.5rem' }}>-${expense}</p>
        </div>
      </div>

      <div className="grid grid-cols-2" style={{ marginTop: '2rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Income vs Expense</h3>
          <div style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}>
            {transactions.length > 0
              ? <Doughnut data={data} options={chartOptions} />
              : <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No transactions to display</p>
            }
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Monthly Expenses</h3>
          <div style={{ width: '100%', margin: '0 auto', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {Object.keys(monthlyExpenses).length > 0
              ? <Bar data={barData} options={barOptions} />
              : <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No expense data</p>
            }
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1" style={{ marginTop: '2rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Recent Transactions</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 5).map(t => (
                  <tr key={t._id}>
                    <td>{t.title}</td>
                    <td className={t.type === 'credit' ? 'text-success' : 'text-danger'}>
                      {t.type === 'credit' ? '+' : '-'}${t.amount}
                    </td>
                    <td>{t.category}</td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No recent transactions</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;