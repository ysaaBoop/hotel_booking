import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setMessage('');

    if (!email || !password) {
      setMessage('Please fill in all fields.');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    navigate('/');
  }

 return (
  <div className="auth-wrapper">
    <div className="auth-card">
      <h1>Login</h1>

      <form className="auth-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="primary-btn" type="submit">Login</button>
      </form>

      {message && <div className="message-box" style={{ marginTop: '16px' }}>{message}</div>}

      <p className="auth-helper">
        No account yet? <Link to="/register">Register</Link>
      </p>
    </div>
  </div>
);
}

export default Login;