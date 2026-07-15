import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Stocks from './pages/Stocks';
import StockChart from './pages/StockChart';
import Portfolio from './pages/Portfolio';
import History from './pages/History';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Users from './pages/Users';
import AllOrders from './pages/AllOrders';
import AllTransactions from './pages/AllTransactions';
import AdminStockChart from './pages/AdminStockChart';
import Login from './components/Login';
import Register from './components/Register';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="app-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/stocks" element={<ProtectedRoute><Stocks /></ProtectedRoute>} />
          <Route path="/stocks/:symbol" element={<ProtectedRoute><StockChart /></ProtectedRoute>} />
          <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><Users /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AllOrders /></AdminRoute>} />
          <Route path="/admin/transactions" element={<AdminRoute><AllTransactions /></AdminRoute>} />
          <Route path="/admin/stocks" element={<AdminRoute><AdminStockChart /></AdminRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
