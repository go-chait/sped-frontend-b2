import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignUpPage.css';

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    const requestBody = { email, password, userName };
    console.log('Request Body:', requestBody);  // Log the request body

    try {
      const response = await fetch('http://localhost:8000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Sign up successful');
        navigate('/admin');
      } else {
        setErrorMessage(data.error || 'Sign up failed');
      }
    } catch (error) {
      setErrorMessage('An error occurred: ' + error.message);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <input 
        type="text" 
        placeholder="Username" 
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="signup-input"
      />
      <input 
        type="email" 
        placeholder="Email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="signup-input"
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="signup-input"
      />
      <button className="signup-button" onClick={handleSignUp}>Sign Up</button>
      {message && <p className="signup-message success">{message}</p>}
      {errorMessage && <p className="signup-message error">{errorMessage}</p>}
      <p className="login-link">
        Already a registered user? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default SignUpPage;
