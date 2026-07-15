import { Link, useNavigate } from 'react-router-dom';
import { useGeneral } from '../context/GeneralContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout, user } = useGeneral();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand">SB Stocks</Link>
      <nav className="nav-links">
        {!isAuthenticated && (
          <>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {isAuthenticated && !isAdmin && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/stocks">Browse Stocks</Link>
            <Link to="/portfolio">Portfolio</Link>
            <Link to="/history">History</Link>
            <Link to="/profile">Profile</Link>
          </>
        )}

        {isAuthenticated && isAdmin && (
          <>
            <Link to="/admin">Admin Dashboard</Link>
            <Link to="/admin/users">Users</Link>
            <Link to="/admin/orders">Orders</Link>
            <Link to="/admin/transactions">Transactions</Link>
            <Link to="/admin/stocks">Stock Charts</Link>
          </>
        )}
      </nav>
      <div className="nav-actions">
        {isAuthenticated ? (
          <>
            <span className="nav-user">{user?.username}</span>
            <button type="button" className="btn btn-secondary" onClick={handleLogout}>Logout</button>
          </>
        ) : null}
      </div>
    </header>
  );
}
