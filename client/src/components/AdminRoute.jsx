import { Navigate } from 'react-router-dom';
import { useGeneral } from '../context/GeneralContext';

export default function AdminRoute({ children }) {
  const { loading, isAuthenticated, isAdmin } = useGeneral();

  if (loading) {
    return <div className="page-state">Loading session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
