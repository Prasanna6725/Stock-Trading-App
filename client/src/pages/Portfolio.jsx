import { useEffect, useState } from 'react';
import axiosInstance from '../components/axiosInstance';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Portfolio() {
  const [portfolios, setPortfolios] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPortfolios = async () => {
    try {
      const { data } = await axiosInstance.get('/portfolios');
      setPortfolios(data.data || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load portfolios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolios();
  }, []);

  const createPortfolio = async (event) => {
    event.preventDefault();
    try {
      await axiosInstance.post('/portfolios', { name, description });
      setName('');
      setDescription('');
      await loadPortfolios();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to create portfolio');
    }
  };

  const removePortfolio = async (portfolioId) => {
    if (!window.confirm('Delete this portfolio?')) return;
    await axiosInstance.delete(`/portfolios/${portfolioId}`);
    await loadPortfolios();
  };

  if (loading) return <LoadingSpinner label="Loading portfolios..." />;

  return (
    <div className="page-stack">
      <section className="card">
        <h1>Portfolios</h1>
        <form className="portfolio-form" onSubmit={createPortfolio}>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Portfolio name" required />
          <input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description" />
          <button className="btn btn-primary" type="submit">Create Portfolio</button>
        </form>
      </section>
      <ErrorMessage message={error} />
      <div className="grid">
        {portfolios.length ? portfolios.map((portfolio) => (
          <article key={portfolio._id} className="card">
            <div className="section-head">
              <div>
                <h2>{portfolio.name}</h2>
                <p>{portfolio.description || 'No description provided.'}</p>
              </div>
              <button className="btn btn-secondary" type="button" onClick={() => removePortfolio(portfolio._id)}>Delete</button>
            </div>
            <div className="stats-grid compact">
              <div className="stat-card card"><span>Invested</span><strong>${portfolio.totals?.totalInvested?.toFixed?.(2) || '0.00'}</strong></div>
              <div className="stat-card card"><span>Current Value</span><strong>${portfolio.totals?.currentValue?.toFixed?.(2) || '0.00'}</strong></div>
              <div className="stat-card card"><span>P/L</span><strong>${portfolio.totals?.profitLoss?.toFixed?.(2) || '0.00'}</strong></div>
            </div>
            {portfolio.holdings?.length ? (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Symbol</th><th>Qty</th><th>Avg Buy</th><th>Current</th><th>P/L</th></tr></thead>
                  <tbody>
                    {portfolio.holdings.map((holding) => (
                      <tr key={holding.symbol}>
                        <td>{holding.symbol}</td>
                        <td>{holding.quantity}</td>
                        <td>${holding.averageBuyPrice.toFixed(2)}</td>
                        <td>${holding.currentPrice.toFixed(2)}</td>
                        <td className={holding.profitLoss >= 0 ? 'positive' : 'negative'}>${holding.profitLoss.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p>No holdings in this portfolio yet.</p>}
          </article>
        )) : <div className="card">No portfolios found.</div>}
      </div>
    </div>
  );
}
