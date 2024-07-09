import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import './AdminPage.css';

Modal.setAppElement('#root'); // This is to prevent screen readers from reading the background content when the modal is open

function StaticAdminPage() {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [inputType, setInputType] = useState('url');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

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
    let requestBody = {};
    if (inputType === 'url') {
      requestBody = { url };
    } else {
      const formData = new FormData();
      formData.append('file', file);
      requestBody = formData;
    }

    try {
      const response = await fetch('http://localhost:8000/scrape-and-store-url', {
        method: 'POST',
        headers: inputType === 'url' ? { 'Content-Type': 'application/json' } : {},
        body: inputType === 'url' ? JSON.stringify(requestBody) : requestBody
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setUrl('');
        setFile(null);
      } else {
        setMessage(data.error || 'Failed to add data');
      }
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
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Example Data</td>
              <td>PDF</td>
              <td>2023-01-01</td>
              <td>Scraped</td>
            </tr>
            <tr>
              <td>Example Data 2</td>
              <td>Link</td>
              <td>2023-01-02</td>
              <td>Failed</td>
            </tr>
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
