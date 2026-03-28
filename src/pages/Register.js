import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setMessage('');

    if (!email || !password) {
      setMessage('Please fill in all fields.');
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage('Registration successful. You can now log in.');
    navigate('/login');
  }

return (
  <div className="auth-wrapper">
    <div className="auth-card">
      <h1>Register</h1>

      <form className="auth-form" onSubmit={handleRegister}>
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

        <button className="primary-btn" type="submit">Register</button>
      </form>

      {message && <div className="message-box" style={{ marginTop: '16px' }}>{message}</div>}

      <p className="auth-helper">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  </div>
);
}

export default Register;