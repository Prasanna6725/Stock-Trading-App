import { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axiosInstance from '../components/axiosInstance';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function AdminStockChart() {
  const [stocks, setStocks] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [stock, setStock] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axiosInstance.get('/admin/stocks');
        const stockList = data.data || [];
        setStocks(stockList);
        const first = stockList.find((item) => item.symbol === selectedSymbol) || stockList[0];
        if (first) {
          setSelectedSymbol(first.symbol);
        }
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load admin stock data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadChart = async () => {
      if (!selectedSymbol) return;
      const [stockResponse, historyResponse] = await Promise.all([
        axiosInstance.get(`/stocks/${selectedSymbol}`),
        axiosInstance.get(`/stocks/${selectedSymbol}/history`),
      ]);
      setStock(stockResponse.data.data);
      setHistory(historyResponse.data.data.historicalData || []);
    };
    loadChart().catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load chart'));
  }, [selectedSymbol]);

  if (loading) return <LoadingSpinner label="Loading admin stock chart..." />;

  const chartData = history.map((item) => ({
    date: new Date(item.date).toLocaleDateString(),
    close: item.close,
  }));

  return (
    <div className="page-stack">
      <section className="card">
        <h1>Admin Stock Chart</h1>
        <select value={selectedSymbol} onChange={(event) => setSelectedSymbol(event.target.value)}>
          {stocks.map((stockItem) => (
            <option key={stockItem._id} value={stockItem.symbol}>{stockItem.symbol} - {stockItem.name}</option>
          ))}
        </select>
      </section>
      <ErrorMessage message={error} />
      {stock ? (
        <section className="card">
          <h2>{stock.symbol} - {stock.name}</h2>
          <p>Latest Price: ${Number(stock.price).toFixed(2)}</p>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" hide />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="close" stroke="#0f766e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      ) : null}
    </div>
  );
}
