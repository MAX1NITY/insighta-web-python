import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfileDetail = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `https://user-profiler-api.vercel.app/api/profiles/${id}`,
          {
            headers: { 'X-API-Version': '1' },
            withCredentials: true
          }
        );
        setProfile(res.data.data);
      } catch (err) {
        console.error('Failed to fetch profile', err);
        if (err.response?.status === 401) navigate('/');
        if (err.response?.status === 404) navigate('/profiles');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!profile) return <p>Profile not found.</p>;

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate('/profiles')}>← Back to Profiles</button>

      <h2>{profile.name}</h2>

      <table border="1" cellPadding="10" style={{ marginTop: '20px', borderCollapse: 'collapse' }}>
        <tbody>
          <tr><td><strong>ID</strong></td><td>{profile.id}</td></tr>
          <tr><td><strong>Gender</strong></td><td>{profile.gender}</td></tr>
          <tr><td><strong>Gender Probability</strong></td><td>{profile.gender_probability}</td></tr>
          <tr><td><strong>Age</strong></td><td>{profile.age}</td></tr>
          <tr><td><strong>Age Group</strong></td><td>{profile.age_group}</td></tr>
          <tr><td><strong>Country</strong></td><td>{profile.country_name}</td></tr>
          <tr><td><strong>Country Code</strong></td><td>{profile.country_id}</td></tr>
          <tr><td><strong>Country Probability</strong></td><td>{profile.country_probability}</td></tr>
          <tr><td><strong>Created At</strong></td><td>{new Date(profile.created_at).toLocaleString()}</td></tr>
        </tbody>
      </table>
    </div>
  );
};
export default ProfileDetail;