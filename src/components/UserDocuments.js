import React, { useState, useEffect } from 'react';
import { viewUserDocs } from '../services/api';
import './UserDocuments.css'; // Add this line to import the CSS


const UserDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = window.localStorage.getItem('access_token');
        const userId = window.localStorage.getItem('userId'); 
        const response = await viewUserDocs(token, userId);
        setDocuments(response.user_docs);
      } catch (error) {
        console.error('Error fetching user documents:', error);
        setMessage(`Error: ${error.detail || JSON.stringify(error)}`);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <div>
      <h2>User Documents</h2>
      {message && <p>{message}</p>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Date</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc._id}>
              <td>{doc.name}</td>
              <td>{doc.type}</td>
              <td>{doc.status}</td>
              <td>{doc.date}</td>
              <td>{doc.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserDocuments;
