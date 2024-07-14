import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';
import { scrapeAndStoreUrl, scrapeAndStoreFileAdmin, viewAdminDocs } from '../services/api';
import './AdminPage.css';
import LoadingSpinner from './LoadingSpinner';

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
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false); 
  const [errorMessage, setErrorMessage] = useState(''); 
  const [scrapeModalIsOpen, setScrapeModalIsOpen] = useState(false); 
  const [scrapeMessage, setScrapeMessage] = useState(''); 
  const [isLoading, setIsLoading] = useState(false); // Track loading state for scraping process

  const [currentPage, setCurrentPage] = useState(1);
  const [documentsPerPage] = useState(5);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = window.localStorage.getItem('access_token');
        const response = await viewAdminDocs(token);
        setDocuments(response.admin_docs);
      } catch (error) {
        console.error('Error fetching admin documents:', error);
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

        if (role.toLowerCase() !== 'admin') {
          throw new Error('Access denied. Only admins can access this platform.');
        }

        setRole(role);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setErrorMessage('Access denied. Only admins can access this platform.'); 
        setErrorModalIsOpen(true); 
      }
    };

    fetchDocuments();
    fetchUserRole();
  }, [navigate]);

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

  const closeErrorModal = () => {
    setErrorModalIsOpen(false);
    navigate('/'); 
  };
  const closeScrapeModal = () => {
    setScrapeModalIsOpen(false);
    setMessage(''); 
  };

  const handleAddData = async () => {
    const token = window.localStorage.getItem('access_token');
    setIsLoading(true); 
    try {
      let response;
      if (inputType === 'url') {
        response = await scrapeAndStoreUrl(url, fileName, token);
      } else {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64Content = e.target.result.split(',')[1];
          response = await scrapeAndStoreFileAdmin(fileName, 'pdf', base64Content, token);
          if (response && response.message) {
            setScrapeMessage(response.message);
            setScrapeModalIsOpen(true);
            setUrl('');
            setFile(null);
            setFileName('');
            closeModal();
          } else {
            throw new Error('Unknown response from server');
          }
          // closeModal(); 
        };
        reader.readAsDataURL(file);
      }
      if (response && response.message) {
        setScrapeMessage(response.message);
        setScrapeModalIsOpen(true);
        closeModal();
        setUrl('');
        setFile(null);
        setFileName('');
      } else {
        throw new Error('Unknown response from server');
      }
      setUrl('');
      setFile(null);
      setFileName('');
    } catch (error) {
      console.error('Scraping error:', error);
      // setScrapeMessage('An error occurred during scraping.');
      setScrapeModalIsOpen(true); 
    }
    finally {
      setIsLoading(false); // Stop loading
    }
  };

  
  const indexOfLastDocument = currentPage * documentsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
  const currentDocuments = documents.slice(indexOfFirstDocument, indexOfLastDocument);

  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
            {currentDocuments.map((doc) => (
              <tr key={doc._id}>
                <td>{doc.name}</td>
                <td>{doc.type}</td>
                <td>{doc.date}</td>
                <td>{doc.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          {[...Array(Math.ceil(documents.length / documentsPerPage)).keys()].map(number => (
            <button key={number + 1} onClick={() => paginate(number + 1)}>
              {number + 1}
            </button>
          ))}
        </div>
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

          <button type="submit" className="modal-button" onClick={openModal} disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : 'Add Data'}
          </button>
        </form>
        {message && <p className="modal-message">{message}</p>}
      </Modal>
      <Modal
        isOpen={errorModalIsOpen}
        onRequestClose={closeErrorModal}
        contentLabel="Error Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <button onClick={closeErrorModal} className="close-button">X</button>
        <h2>Error</h2>
        <p>{errorMessage}</p>
        <button onClick={closeErrorModal} className="modal-button">Close</button>
      </Modal>
      <Modal
        isOpen={scrapeModalIsOpen}
        onRequestClose={closeScrapeModal}
        contentLabel="Scrape Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <button onClick={closeScrapeModal} className="close-button">X</button>
        <h2>Scraping Result</h2>
        <p>{scrapeMessage}</p>
        <button onClick={closeScrapeModal} className="modal-button">Close</button>
      </Modal>
    </div>
  );
}

export default StaticAdminPage;
