import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          'https://user-profiler-api.vercel.app/api/profiles',
          {
            headers: { 'X-API-Version': '1' },
            withCredentials: true
          }
        );
        setStats({ total: res.data.total });
      } catch (err) {
        console.error('Not authorized or session expired');
        if (err.response?.status === 401) navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Insighta Labs+ Dashboard</h2>

      {/* Basic metrics */}
      <div style={{ marginBottom: '30px' }}>
        <p>Total Profiles: <strong>{stats?.total ?? 0}</strong></p>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => navigate('/profiles')}>View Profiles</button>
        <button onClick={() => navigate('/search')}>Search</button>
        <button onClick={() => navigate('/account')}>My Account</button>
      </div>
    </div>
  );
};
export default Dashboard;