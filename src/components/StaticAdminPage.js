import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';
import { scrapeAndStoreUrl, scrapeAndStoreFileAdmin, viewUserDocs, scrapeAndStoreFileUser } from '../services/api'; // Import the API functions
import './AdminPage.css';

Modal.setAppElement('#root'); 

function StaticAdminPage() {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [inputType, setInputType] = useState('url');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [message, setMessage] = useState('');
  const [documents, setDocuments] = useState([]);
  const [role, setRole] = useState('');

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

    const fetchUserRole = async () => {
      try {
        const token = window.localStorage.getItem('access_token');
        const userId = window.localStorage.getItem('userId');

        if (!userId) {
          throw new Error('User ID is not defined');
        }

        const response = await axios.get(`http://localhost:8000/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const role = response.data.role;
        window.localStorage.setItem('role', role);
    
        setRole(response.data.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchDocuments();
    fetchUserRole();
  }, []);

  const handleLogout = () => {
    navigate('/');
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setMessage('');
  };

  const handleAddData = async () => {
    const token = window.localStorage.getItem('access_token');
    // const role = window.localStorage.getItem('role');
    try {
      let response;
      if (inputType === 'url') {
        response = await scrapeAndStoreUrl(url, fileName, token);
      } else {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64Content = e.target.result.split(',')[1];
          if (role.toLowerCase() === 'user') {
            response = await scrapeAndStoreFileUser(fileName, 'pdf', base64Content, token);
          } else if (role.toLowerCase() === 'admin') {
            response = await scrapeAndStoreFileAdmin(fileName, 'pdf', base64Content, token);
          } else {
            setMessage('Access denied. Only users with the role "user" or "admin" can upload PDFs.');
            return;
          }
          setMessage(response.message);
          closeModal();
        };
        reader.readAsDataURL(file);
      }
      setMessage(response.message);
      setUrl('');
      setFile(null);
      setFileName('');
    } catch (error) {
      setMessage('An error occurred: ' + error.message);
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>
      <div className="content-container">
        <button className="add-data-button" onClick={openModal}>Add Data</button>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Date</th>
              <th>Status</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc._id}>
                <td>{doc.name}</td>
                <td>{doc.type}</td>
                <td>{doc.date}</td>
                <td>{doc.status}</td>
                <td>{doc.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add Data Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <button onClick={closeModal} className="close-button">X</button>
        <h2>Add Data</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleAddData(); }}>
          <label>
            Data Type:
            <select value={inputType} onChange={(e) => setInputType(e.target.value)} className="modal-select">
              <option value="url">URL</option>
              <option value="pdf">PDF</option>
            </select>
          </label>
          <label>
            Name:
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              required
              className="modal-input"
            />
          </label>
          {inputType === 'url' ? (
            <label>
              URL:
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="modal-input"
              />
            </label>
          ) : (
            <label>
              Upload PDF:
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                required
                className="modal-input"
              />
            </label>
          )}
          <button type="submit" className="modal-button">Add</button>
        </form>
        {message && <p className="modal-message">{message}</p>}
      </Modal>
    </div>
  );
}

export default StaticAdminPage;
