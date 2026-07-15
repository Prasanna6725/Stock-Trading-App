import { useEffect, useState } from 'react';
import axiosInstance from '../components/axiosInstance';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axiosInstance.get('/admin/orders');
        setOrders(data.data || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load orders');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner label="Loading orders..." />;

  return (
    <div className="page-stack">
      <section className="card"><h1>All Orders</h1></section>
      <ErrorMessage message={error} />
      <div className="card table-wrap">
        <table>
          <thead><tr><th>User</th><th>Symbol</th><th>Type</th><th>Qty</th><th>Price</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.user?.username || 'N/A'}</td>
                <td>{order.symbol}</td>
                <td>{order.orderType}</td>
                <td>{order.quantity}</td>
                <td>${Number(order.price).toFixed(2)}</td>
                <td>${Number(order.totalAmount).toFixed(2)}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
