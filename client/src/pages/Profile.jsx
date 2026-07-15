import { useEffect, useState } from 'react';
import axiosInstance from '../components/axiosInstance';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useGeneral } from '../context/GeneralContext';

export default function Profile() {
  const { user, syncProfile } = useGeneral();
  const [form, setForm] = useState({ username: '', contact: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({ username: user.username || '', contact: user.contact || '' });
      setLoading(false);
    }
  }, [user]);

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const { data } = await axiosInstance.put('/users/profile', form);
      if (data.success) {
        setMessage('Profile updated successfully');
        await syncProfile();
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading profile..." />;

  return (
    <div className="page-stack">
      <section className="card">
        <h1>Profile</h1>
        <p>Role: {user?.role}</p>
        <p>Virtual Balance: ${Number(user?.balance || 0).toFixed(2)}</p>
      </section>
      <ErrorMessage message={error} />
      {message ? <div className="alert alert-success">{message}</div> : null}
      <form className="card form-grid" onSubmit={saveProfile}>
        <label>
          Username
          <input value={form.username} onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))} />
        </label>
        <label>
          Contact
          <input value={form.contact} onChange={(event) => setForm((current) => ({ ...current, contact: event.target.value }))} />
        </label>
        <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Update Profile'}</button>
      </form>
    </div>
  );
}
