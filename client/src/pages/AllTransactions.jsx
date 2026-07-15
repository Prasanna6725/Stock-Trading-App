import { useEffect, useState } from 'react';
import axiosInstance from '../components/axiosInstance';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function AllTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axiosInstance.get('/admin/transactions');
        setTransactions(data.data || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load transactions');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner label="Loading transactions..." />;

  return (
    <div className="page-stack">
      <section className="card"><h1>All Transactions</h1></section>
      <ErrorMessage message={error} />
      <div className="card table-wrap">
        <table>
          <thead><tr><th>User</th><th>Symbol</th><th>Type</th><th>Qty</th><th>Price</th><th>Amount</th><th>Timestamp</th></tr></thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{transaction.user?.username || 'N/A'}</td>
                <td>{transaction.symbol}</td>
                <td>{transaction.type}</td>
                <td>{transaction.quantity}</td>
                <td>${Number(transaction.price).toFixed(2)}</td>
                <td>${Number(transaction.amount).toFixed(2)}</td>
                <td>{new Date(transaction.createdAt || transaction.time).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
