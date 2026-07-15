import { Navigate } from 'react-router-dom';
import { useGeneral } from '../context/GeneralContext';

export default function ProtectedRoute({ children }) {
  const { loading, isAuthenticated } = useGeneral();

  if (loading) {
    return <div className="page-state">Loading session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
