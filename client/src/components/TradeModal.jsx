export default function TradeModal({ title, quantity, setQuantity, portfolioId, setPortfolioId, portfolios, onSubmit, loading, actionLabel }) {
  return (
    <form className="card trade-form" onSubmit={onSubmit}>
      <h3>{title}</h3>
      <label>
        Portfolio
        <select value={portfolioId} onChange={(event) => setPortfolioId(event.target.value)} required>
          <option value="">Select portfolio</option>
          {portfolios.map((portfolio) => (
            <option key={portfolio._id} value={portfolio._id}>{portfolio.name}</option>
          ))}
        </select>
      </label>
      <label>
        Quantity
        <input type="number" min="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} required />
      </label>
      <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Processing...' : actionLabel}</button>
    </form>
  );
}
