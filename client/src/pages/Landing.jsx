import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="landing">
      <section className="hero card">
        <p className="eyebrow">SB Stocks</p>
        <h1>Virtual stock market learning with real market structure.</h1>
        <p>
          Explore US-listed stocks, test trading strategies, manage paper portfolios, and practice
          buy/sell decisions using virtual balance only.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/register">Register</Link>
          <Link className="btn btn-secondary" to="/login">Login</Link>
        </div>
      </section>
      <section className="feature-grid">
        <article className="card"><h3>Risk-free paper trading</h3><p>Trade with virtual funds and learn market mechanics safely.</p></article>
        <article className="card"><h3>Portfolio tracking</h3><p>Create multiple portfolios and measure performance with P/L.</p></article>
        <article className="card"><h3>Strategy analysis</h3><p>Test moving average crossover logic on historical price data.</p></article>
        <article className="card"><h3>Admin monitoring</h3><p>Inspect users, orders, transactions, and market data from the admin console.</p></article>
      </section>
    </div>
  );
}
