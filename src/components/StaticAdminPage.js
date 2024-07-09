import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import './AdminPage.css';

Modal.setAppElement('#root'); // This is to prevent screen readers from reading the background content when the modal is open

function StaticAdminPage() {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
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
    try {
      const response = await fetch('http://localhost:8000/scrape-and-store-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url, name })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setUrl('');
        setName('');
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
        <h2>Add Data</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleAddData(); }}>
          <label>
            URL:
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </label>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="modal-button">Submit</button>
          <button type="button" className="modal-button" onClick={closeModal}>Cancel</button>
        </form>
        {message && <p className="modal-message">{message}</p>}
      </Modal>
    </div>
  );
}

export default StaticAdminPage;
