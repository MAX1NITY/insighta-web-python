import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ gender: '', country_id: '', age_group: '' });
  const navigate = useNavigate();

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (filters.gender)     params.append('gender', filters.gender);
      if (filters.country_id) params.append('country_id', filters.country_id);
      if (filters.age_group)  params.append('age_group', filters.age_group);

      const res = await axios.get(
        `https://user-profiler-api.vercel.app/api/profiles?${params.toString()}`,
        {
          headers: { 'X-API-Version': '1' },
          withCredentials: true
        }
      );
      setProfiles(res.data.data);
      setTotalPages(res.data.total_pages);
    } catch (err) {
      console.error('Failed to fetch profiles', err);
      if (err.response?.status === 401) navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [page]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProfiles();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Profiles</h2>

      {/* Filters */}
      <form onSubmit={handleFilterSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <select
          value={filters.gender}
          onChange={e => setFilters({ ...filters, gender: e.target.value })}
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <input
          type="text"
          placeholder="Country code e.g. NG"
          value={filters.country_id}
          onChange={e => setFilters({ ...filters, country_id: e.target.value })}
        />

        <select
          value={filters.age_group}
          onChange={e => setFilters({ ...filters, age_group: e.target.value })}
        >
          <option value="">All Age Groups</option>
          <option value="child">Child</option>
          <option value="teenager">Teenager</option>
          <option value="adult">Adult</option>
          <option value="senior">Senior</option>
        </select>

        <button type="submit">Filter</button>
      </form>

      {/* Table */}
      {loading ? <p>Loading...</p> : (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Age Group</th>
              <th>Country</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.gender}</td>
                <td>{p.age}</td>
                <td>{p.age_group}</td>
                <td>{p.country_name}</td>
                <td>
                  <button onClick={() => navigate(`/profiles/${p.id}`)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
          Next
        </button>
      </div>

      <button onClick={() => navigate('/dashboard')} style={{ marginTop: '20px' }}>
        Back to Dashboard
      </button>
    </div>
  );
};
export default Profiles;