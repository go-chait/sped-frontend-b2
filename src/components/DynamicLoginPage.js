import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

function DynamicLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      console.log("Login COMPLETE: ")
      console.log(data)

      window.localStorage.setItem("access_token", data?.access_token)

      window.localStorage.setItem('userId', data?.user['_id']); // Store the user ID
      window.localStorage.setItem('role', data?.user['role']); // Store the user ID

      if (response.ok) {
        setMessage('Login successful');
        navigate('/admin');
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (error) {
      setMessage('An error occurred: ' + error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <input 
        type="text" 
        placeholder="Email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="login-input"
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="login-input"
      />
      <button className="login-button" onClick={handleLogin}>Login</button>
      {message && <p className="login-message">{message}</p>}
      <p className="signup-link">
        Not a user? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

export default DynamicLoginPage;
