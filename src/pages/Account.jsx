import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Account = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          'https://user-profiler-api.vercel.app/api/me',
          {
            headers: { 'X-API-Version': '1' },
            withCredentials: true
          }
        );
        setUser(res.data.data);
      } catch (err) {
        console.error('Failed to fetch user', err);
        if (err.response?.status === 401) navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        'https://user-profiler-api.vercel.app/auth/logout',
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      navigate('/');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Not logged in.</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Account</h2>

      <div style={{ marginTop: '20px' }}>
        {user.avatar_url && (
          <img
            src={user.avatar_url}
            alt="avatar"
            style={{ width: '80px', borderRadius: '50%', marginBottom: '10px' }}
          />
        )}
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse' }}>
          <tbody>
            <tr><td><strong>Username</strong></td><td>@{user.username}</td></tr>
            <tr><td><strong>Role</strong></td><td>{user.role}</td></tr>
            <tr><td><strong>Status</strong></td><td>{user.is_active ? 'Active' : 'Inactive'}</td></tr>
          </tbody>
        </table>
      </div>

      <button
        onClick={handleLogout}
        style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer', background: 'red', color: 'white', border: 'none' }}
      >
        Logout
      </button>

      <button onClick={() => navigate('/dashboard')} style={{ marginTop: '20px', marginLeft: '10px' }}>
        Back to Dashboard
      </button>
    </div>
  );
};
export default Account;