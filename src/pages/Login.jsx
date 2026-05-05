const Login = () => {
  const handleLogin = () => {
    const state = crypto.randomUUID();

    sessionStorage.setItem('oauth_state', state);
    // Redirect to your BACKEND's GitHub auth route
    window.location.href = `https://user-profiler-api.vercel.app/auth/github?state=${state}`;
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Insighta Labs+</h1>
      <p>Analyst Portal</p>
      <button onClick={handleLogin} style={{ padding: '10px 20px', cursor: 'pointer' }}>
        Login with GitHub
      </button>
    </div>
  );
};
export default Login;