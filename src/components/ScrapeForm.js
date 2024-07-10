
import React, { useState } from 'react';
import { scrapeAndStoreUrl } from '../services/api';

const ScrapeForm = () => {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = window.localStorage.getItem('access_token');
      const response = await scrapeAndStoreUrl(url, name, token);
      setMessage(response.message);
      setError('');
    } catch (err) {
      setError(err.detail);
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Scrape and Store URL</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>URL:</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Scrape</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ScrapeForm;
