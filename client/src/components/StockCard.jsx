import { Link } from 'react-router-dom';

export default function StockCard({ stock }) {
  return (
    <article className="card stock-card">
      <div className="card-head">
        <div>
          <h3>{stock.symbol}</h3>
          <p>{stock.name}</p>
        </div>
        <span className={stock.change >= 0 ? 'pill pill-positive' : 'pill pill-negative'}>
          {stock.change >= 0 ? '+' : ''}{stock.change} ({stock.changePercent}%)
        </span>
      </div>
      <div className="card-meta">
        <span>{stock.stockExchange}</span>
        <strong>${Number(stock.price).toFixed(2)}</strong>
      </div>
      <Link to={`/stocks/${stock.symbol}`} className="btn btn-primary btn-block">View Details</Link>
    </article>
  );
}
