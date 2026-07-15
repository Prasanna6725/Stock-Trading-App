import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from './axiosInstance';
import ErrorMessage from './ErrorMessage';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '', contact: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const validate = () => {
    if (!form.username || !form.email || !form.password) return 'All required fields must be filled';
    if (!form.email.includes('@')) return 'Enter a valid email address';
    if (form.password.length < 6) return 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) return 'Passwords do not match';
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationMessage = validate();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await axiosInstance.post('/users/register', {
        username: form.username,
        email: form.email,
        password: form.password,
        contact: form.contact,
      });
      if (data.success) {
        setMessage('Registration successful. Redirecting to login...');
        setTimeout(() => navigate('/login'), 900);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <ErrorMessage message={error} />
        {message ? <div className="alert alert-success">{message}</div> : null}
        <label>
          Username
          <input name="username" value={form.username} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>
        <label>
          Confirm Password
          <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required />
        </label>
        <label>
          Contact
          <input name="contact" value={form.contact} onChange={handleChange} />
        </label>
        <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
        <p>Already registered? <Link to="/login">Login here</Link></p>
      </form>
    </div>
  );
}
