import { useEffect, useState } from 'react';
import axiosInstance from '../components/axiosInstance';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import StockCard from '../components/StockCard';

export default function Stocks() {
  const [stocks, setStocks] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [demoMode, setDemoMode] = useState(false);

  const loadStocks = async (searchValue = '') => {
    setLoading(true);
    setError('');
    try {
      const endpoint = searchValue ? `/stocks/search?query=${encodeURIComponent(searchValue)}` : '/stocks';
      const { data } = await axiosInstance.get(endpoint);
      setStocks(data.data || []);
      setDemoMode((data.data || []).some((stock) => stock.marketStatus === 'DEMO'));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load stocks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStocks();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    loadStocks(query);
  };

  if (loading) return <LoadingSpinner label="Loading stocks..." />;

  return (
    <div className="page-stack">
      <section className="card">
        <h1>Browse Stocks</h1>
        <form className="search-row" onSubmit={handleSubmit}>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by symbol or company name" />
          <button className="btn btn-primary" type="submit">Search</button>
        </form>
        {demoMode ? <div className="alert alert-info">Demo market data is being displayed.</div> : null}
      </section>
      <ErrorMessage message={error} />
      {stocks.length ? (
        <section className="grid cards-grid">
          {stocks.map((stock) => <StockCard key={stock._id || stock.symbol} stock={stock} />)}
        </section>
      ) : <div className="card">No stocks found.</div>}
    </div>
  );
}
