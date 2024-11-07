import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NasaImages = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [displayedImages, setDisplayedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); 
  const [isLoading, setIsLoading] = useState(false);

  const API_KEY = process.env.REACT_APP_NASA_API_KEY;
  const BASE_URL = 'https://images-api.nasa.gov';
  const perPage = 5; 

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/search`, {
        params: {
          q: query,
          media_type: 'image',
        },
      });
      setImages(response.data.collection.items);
      setPage(1); 
      setError(null);
    } catch (err) {
      setError('Error fetching images. Please try again later.');
    }
    setIsLoading(false);
  };

  
  useEffect(() => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    setDisplayedImages(images.slice(start, end));
  }, [images, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchImages();
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeDetails = () => {
    setSelectedImage(null);
  };

  const handleNextPage = () => {
    if (page < Math.ceil(images.length / perPage)) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div>
      <h1>NASA Image Search</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for space images..."
          required
        />
        <button type="submit">Search</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          displayedImages.map((item, index) => (
            <div
              key={index}
              style={{ width: '200px', cursor: 'pointer' }}
              onClick={() => handleImageClick(item)}
            >
              {item.links && item.links[0] && (
                <img
                  src={item.links[0].href}
                  alt={item.data[0].title}
                  style={{ width: '100%' }}
                />
              )}
              <p>{item.data[0].title}</p>
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '10px' }}>
        <button onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </button>
        <button onClick={handleNextPage} disabled={page >= Math.ceil(images.length / perPage)}>
          Next
        </button>
      </div>

      {selectedImage && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            backgroundColor: 'white',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            width: '400px',
            maxHeight: '80vh',
            overflowY: 'auto',
            zIndex: 1000,
          }}
        >
          <button onClick={closeDetails} style={{ float: 'right' }}>Close</button>
          <h2>{selectedImage.data[0].title}</h2>
          <img
            src={selectedImage.links[0].href}
            alt={selectedImage.data[0].title}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <p><strong>Description:</strong> {selectedImage.data[0].description}</p>
          <p><strong>Date Created:</strong> {selectedImage.data[0].date_created}</p>
          <p><strong>Keywords:</strong> {selectedImage.data[0].keywords ? selectedImage.data[0].keywords.join(', ') : 'N/A'}</p>
        </div>
      )}
    </div>
  );
};

export default NasaImages;


