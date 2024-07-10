
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Adjust the base URL to match your FastAPI server

export const scrapeAndStoreUrl = async (url, name, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/scrape/scrape-and-store-url`,
      { url, name },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const scrapeAndStoreFileAdmin = async (name, contentType, content, token) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/scrape/scrape-and-store-file-admin`,
        { name, content_type: contentType, content },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };



export const scrapeAndStoreFileUser = async (name, contentType, content, token) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/scrape/scrape-and-store-file-user`,
        { name, content_type: contentType, content },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response)
      return response.data;
    } catch (error) {
      console.error('Error in scrapeAndStoreFileUser:', error);
      throw error.response.data;
    }
  };



export const viewUserDocs = async (token, userId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/scrape/view-user-docs`,
      {
        params: { user_id: userId },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};