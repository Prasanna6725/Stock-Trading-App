import { useEffect, useState } from 'react';
import axiosInstance from '../components/axiosInstance';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axiosInstance.get('/admin/dashboard');
        setStats(data.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load admin dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner label="Loading admin dashboard..." />;

  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="page-stack">
      <section className="card">
        <h1>Admin Dashboard</h1>
      </section>
      <section className="stats-grid">
        <div className="card stat-card"><span>Total Users</span><strong>{stats.totalUsers}</strong></div>
        <div className="card stat-card"><span>Total Stocks</span><strong>{stats.totalStocks}</strong></div>
        <div className="card stat-card"><span>Total Orders</span><strong>{stats.totalOrders}</strong></div>
        <div className="card stat-card"><span>Total Transactions</span><strong>{stats.totalTransactions}</strong></div>
        <div className="card stat-card"><span>BUY</span><strong>{stats.buyTransactions}</strong></div>
        <div className="card stat-card"><span>SELL</span><strong>{stats.sellTransactions}</strong></div>
      </section>
      <section className="card">
        <h2>Recent Activity</h2>
        {stats.recentActivity?.length ? (
          <ul className="activity-list">
            {stats.recentActivity.map((item) => (
              <li key={item._id}>{item.user?.username} placed a {item.type} for {item.symbol}</li>
            ))}
          </ul>
        ) : <p>No recent activity.</p>}
      </section>
    </div>
  );
}
