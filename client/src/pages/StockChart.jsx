import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axiosInstance from '../components/axiosInstance';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import TradeModal from '../components/TradeModal';
import { useGeneral } from '../context/GeneralContext';

export default function StockChart() {
  const { symbol } = useParams();
  const { portfolios, setPortfolios } = useGeneral();
  const [stock, setStock] = useState(null);
  const [history, setHistory] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [portfolioId, setPortfolioId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [loading, setLoading] = useState(true);
  const [tradeLoading, setTradeLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadStock = async () => {
      try {
        const [stockResponse, historyResponse] = await Promise.all([
          axiosInstance.get(`/stocks/${symbol}`),
          axiosInstance.get(`/stocks/${symbol}/history`),
        ]);
        setStock(stockResponse.data.data);
        setHistory(historyResponse.data.data.historicalData || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load stock');
      } finally {
        setLoading(false);
      }
    };
    loadStock();
  }, [symbol]);

  const chartData = useMemo(() => history.map((item) => ({
    date: new Date(item.date).toLocaleDateString(),
    close: item.close,
  })), [history]);

  const refreshPortfolioData = async () => {
    const { data } = await axiosInstance.get('/portfolios');
    setPortfolios(data.data || []);
  };

  const submitTrade = async (tradeType) => {
    setTradeLoading(true);
    setError('');
    setMessage('');
    try {
      const { data } = await axiosInstance.post(`/transactions/${tradeType}`, {
        symbol,
        quantity: Number(quantity),
        portfolioId,
      });
      if (data.success) {
        setMessage(data.message);
        await refreshPortfolioData();
        const updatedStock = await axiosInstance.get(`/stocks/${symbol}`);
        setStock(updatedStock.data.data);
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Trade failed');
    } finally {
      setTradeLoading(false);
    }
  };

  const runAnalysis = async () => {
    try {
      const { data } = await axiosInstance.post(`/stocks/${symbol}/analyze`, {
        strategy: 'SMA_CROSSOVER',
        shortWindow: 5,
        longWindow: 20,
      });
      setAnalysis(data.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to analyze strategy');
    }
  };

  if (loading) return <LoadingSpinner label="Loading stock details..." />;
  if (error && !stock) return <ErrorMessage message={error} />;

  return (
    <div className="page-stack">
      <section className="card">
        <h1>{stock.symbol} - {stock.name}</h1>
        <div className="stock-summary">
          <div><span>Latest Price</span><strong>${Number(stock.price).toFixed(2)}</strong></div>
          <div><span>Exchange</span><strong>{stock.stockExchange}</strong></div>
          <div><span>Change</span><strong className={stock.change >= 0 ? 'positive' : 'negative'}>{stock.change} ({stock.changePercent}%)</strong></div>
        </div>
        <p>{stock.marketStatus === 'DEMO' ? 'Demo market data is being displayed.' : 'Latest available market data loaded.'}</p>
      </section>
      <section className="card chart-card">
        <h2>Historical Chart</h2>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" hide />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Line type="monotone" dataKey="close" stroke="#2563eb" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="grid split-grid">
        <TradeModal title="Buy Stock" quantity={quantity} setQuantity={setQuantity} portfolioId={portfolioId} setPortfolioId={setPortfolioId} portfolios={portfolios} onSubmit={(event) => { event.preventDefault(); submitTrade('buy'); }} loading={tradeLoading} actionLabel="Buy" />
        <TradeModal title="Sell Stock" quantity={quantity} setQuantity={setQuantity} portfolioId={portfolioId} setPortfolioId={setPortfolioId} portfolios={portfolios} onSubmit={(event) => { event.preventDefault(); submitTrade('sell'); }} loading={tradeLoading} actionLabel="Sell" />
      </section>
      <section className="card">
        <div className="section-head">
          <h2>Strategy Analysis</h2>
          <button className="btn btn-secondary" type="button" onClick={runAnalysis}>Run SMA Crossover</button>
        </div>
        {analysis ? (
          <div className="analysis-box">
            <p><strong>Strategy Return:</strong> {analysis.strategyReturn}%</p>
            <p><strong>Buy and Hold Return:</strong> {analysis.buyAndHoldReturn}%</p>
            <p><strong>Signals:</strong> {analysis.signals.length}</p>
            <p>{analysis.interpretation}</p>
            <small>{analysis.disclaimer}</small>
          </div>
        ) : <p>Run a strategy test to compare historical returns.</p>}
      </section>
      {message ? <div className="alert alert-success">{message}</div> : null}
      {error ? <ErrorMessage message={error} /> : null}
    </div>
  );
}
