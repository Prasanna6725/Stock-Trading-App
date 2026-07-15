import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../components/axiosInstance';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useGeneral } from '../context/GeneralContext';

export default function Dashboard() {
  const { user, portfolios, setPortfolios } = useGeneral();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState({ balance: 0, totalInvested: 0, currentValue: 0, profitLoss: 0, recentTransactions: [] });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [profileResponse, portfolioResponse, transactionResponse] = await Promise.all([
          axiosInstance.get('/users/profile'),
          axiosInstance.get('/portfolios'),
          axiosInstance.get('/transactions/history'),
        ]);
        const profile = profileResponse.data.data;
        const portfolioData = portfolioResponse.data.data || [];
        const transactions = transactionResponse.data.data || [];
        setPortfolios(portfolioData);
        const totals = portfolioData.reduce((accumulator, portfolio) => {
          accumulator.totalInvested += portfolio.totals?.totalInvested || 0;
          accumulator.currentValue += portfolio.totals?.currentValue || 0;
          accumulator.profitLoss += portfolio.totals?.profitLoss || 0;
          return accumulator;
        }, { totalInvested: 0, currentValue: 0, profitLoss: 0 });
        setSummary({
          balance: profile.balance,
          totalInvested: totals.totalInvested,
          currentValue: totals.currentValue,
          profitLoss: totals.profitLoss,
          recentTransactions: transactions.slice(0, 5),
        });
      } catch (loadError) {
        setError(loadError.response?.data?.message || 'Unable to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [setPortfolios]);

  if (loading) return <LoadingSpinner label="Loading dashboard..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="page-stack">
      <section className="dashboard-hero card">
        <h1>Welcome back, {user?.username || 'Trader'}</h1>
        <p>Track virtual funds, holdings, and recent trading activity from one place.</p>
      </section>
      <section className="stats-grid">
        <div className="card stat-card"><span>Virtual Balance</span><strong>${Number(summary.balance).toFixed(2)}</strong></div>
        <div className="card stat-card"><span>Portfolios</span><strong>{portfolios.length}</strong></div>
        <div className="card stat-card"><span>Total Portfolio Value</span><strong>${Number(summary.currentValue).toFixed(2)}</strong></div>
        <div className="card stat-card"><span>Total P/L</span><strong className={summary.profitLoss >= 0 ? 'positive' : 'negative'}>${Number(summary.profitLoss).toFixed(2)}</strong></div>
      </section>
      <section className="quick-actions card">
        <h2>Quick Actions</h2>
        <div className="action-row">
          <Link className="btn btn-primary" to="/stocks">Browse Stocks</Link>
          <Link className="btn btn-secondary" to="/portfolio">Create Portfolio</Link>
          <Link className="btn btn-secondary" to="/portfolio">View Portfolio</Link>
          <Link className="btn btn-secondary" to="/history">View History</Link>
        </div>
      </section>
      <section className="card">
        <h2>Recent Transactions</h2>
        {summary.recentTransactions.length ? (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Symbol</th><th>Type</th><th>Qty</th><th>Amount</th></tr></thead>
              <tbody>
                {summary.recentTransactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>{transaction.symbol}</td>
                    <td><span className={transaction.type === 'BUY' ? 'pill pill-positive' : 'pill pill-negative'}>{transaction.type}</span></td>
                    <td>{transaction.quantity}</td>
                    <td>${Number(transaction.amount).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p>No transactions yet.</p>}
      </section>
    </div>
  );
}
