import { useEffect, useState } from 'react';
import axiosInstance from '../components/axiosInstance';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axiosInstance.get('/admin/users');
        setUsers(data.data || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load users');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner label="Loading users..." />;

  return (
    <div className="page-stack">
      <section className="card"><h1>Registered Users</h1></section>
      <ErrorMessage message={error} />
      <div className="card table-wrap">
        <table>
          <thead><tr><th>Username</th><th>Email</th><th>Contact</th><th>Role</th><th>Balance</th></tr></thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.contact || 'N/A'}</td>
                <td>{user.role}</td>
                <td>${Number(user.balance).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
