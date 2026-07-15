import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from './axiosInstance';
import { useGeneral } from '../context/GeneralContext';
import ErrorMessage from './ErrorMessage';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useGeneral();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/users/login', form);
      if (data.success) {
        login(data.data);
        navigate(data.data.user.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <ErrorMessage message={error} />
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>
        <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
        <p>New user? <Link to="/register">Register here</Link></p>
      </form>
    </div>
  );
}
