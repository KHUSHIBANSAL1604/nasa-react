import React, { useState } from 'react';
import axios from 'axios';

const NasaImages = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);

  const API_KEY = process.env.REACT_APP_NASA_API_KEY;
  const BASE_URL = 'https://images-api.nasa.gov';

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/search`, {
        params: {
          q: query,
        },
      });
      setImages(response.data.collection.items);
      setError(null);
    } catch (err) {
      setError('Error fetching images. Please try again later.');
    }
  };

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
return (
 <div>
      <h1>NASA Image Search</h1>
      <form
     onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for space images..."
        />
        <button type="submit">Search</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {images.map((item, index) => (
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
        ))}
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

