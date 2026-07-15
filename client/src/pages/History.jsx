import { useEffect, useState } from 'react';
import axiosInstance from '../components/axiosInstance';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function History() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const { data } = await axiosInstance.get('/transactions/history');
        setTransactions(data.data || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load transaction history');
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  if (loading) return <LoadingSpinner label="Loading transaction history..." />;

  return (
    <div className="page-stack">
      <section className="card">
        <h1>Transaction History</h1>
      </section>
      <ErrorMessage message={error} />
      {transactions.length ? (
        <div className="card table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Symbol</th><th>Type</th><th>Qty</th><th>Price</th><th>Amount</th><th>Portfolio</th></tr></thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td>{new Date(transaction.createdAt || transaction.time).toLocaleString()}</td>
                  <td>{transaction.symbol}</td>
                  <td><span className={transaction.type === 'BUY' ? 'pill pill-positive' : 'pill pill-negative'}>{transaction.type}</span></td>
                  <td>{transaction.quantity}</td>
                  <td>${Number(transaction.price).toFixed(2)}</td>
                  <td>${Number(transaction.amount).toFixed(2)}</td>
                  <td>{transaction.portfolio?.name || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <div className="card">No transactions yet.</div>}
    </div>
  );
}
