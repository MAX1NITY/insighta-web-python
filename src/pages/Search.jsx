import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await axios.get(
        `https://user-profiler-api.vercel.app/api/profiles/search?q=${encodeURIComponent(query)}`,
        {
          headers: { 'X-API-Version': '1' },
          withCredentials: true
        }
      );
      setResults(res.data.data);
    } catch (err) {
      console.error('Search failed', err);
      if (err.response?.status === 401) navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Search Profiles</h2>

      <form onSubmit={handleSearch} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder='e.g. "young males from nigeria"'
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ width: '400px', padding: '8px' }}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {searched && !loading && results.length === 0 && (
        <p>No results found for "{query}"</p>
      )}

      {results.length > 0 && (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Country</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.gender}</td>
                <td>{p.age}</td>
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

      <button onClick={() => navigate('/dashboard')} style={{ marginTop: '20px' }}>
        Back to Dashboard
      </button>
    </div>
  );
};
export default Search;