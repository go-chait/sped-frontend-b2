
import React, { useState } from 'react';
import { scrapeAndStoreFileAdmin } from '../services/api';

const ScrapeFileFormAdmin = () => {
  const [name, setName] = useState('');
  const [contentType, setContentType] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage('Please select a file');
      return;
    }

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Content = reader.result.split(',')[1]; // Get the base64 part after comma

        // Retrieve the token from local storage
        const token = window.localStorage.getItem('access_token');

        const response = await scrapeAndStoreFileAdmin(name, contentType, base64Content, token);
        setMessage(response.message);
      };
    } catch (error) {
      setMessage(`Error: ${error.detail || error.message}`);
    }
  };

  return (
    <div>
      <h2>Scrape and Store File (Admin)</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Content Type:</label>
          <input type="text" value={contentType} onChange={(e) => setContentType(e.target.value)} required />
        </div>
        <div>
          <label>File:</label>
          <input type="file" onChange={handleFileChange} required />
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ScrapeFileFormAdmin;
