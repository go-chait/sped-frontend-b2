// src/components/ScrapeFileFormUser.js

import React, { useState } from 'react';
import { scrapeAndStoreFileUser } from '../services/api';

const ScrapeFileFormUser = () => {
  const [name, setName] = useState('');
  const [contentType, setContentType] = useState('pdf'); // Assuming the content type is always PDF
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

        try {
          const response = await scrapeAndStoreFileUser(name, contentType, base64Content, token);
          setMessage(response.message);
        } catch (error) {
          console.error('Error submitting file:', error);
          setMessage(`Error: ${error.detail || JSON.stringify(error)}`);
        }
      };
    } catch (error) {
      console.error('Error processing file:', error);
      setMessage(`Error: ${error.detail || JSON.stringify(error)}`);
    }
  };

  return (
    <div>
      <h2>Scrape and Store File (User)</h2>
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

export default ScrapeFileFormUser;
