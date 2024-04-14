import React, { useState, useEffect } from 'react';
import { searchImages } from '../services/pixabayApi';

import styles from './App.module.css';

import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import Button from './Button/Button';
import Modal from './Modal/Modal';

const App = () => {
  const [images, setImages] = useState([]);
  const [loadMore, setLoadMore] = useState(false);
  const [perPage] = useState(12);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showImage, setShowImage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true);
      setLoadMore(false);
      setError(null);

      try {
        const {
          data: { hits: newImages, totalHits },
        } = await searchImages({
          query,
          page,
          per_page: perPage,
        });

        setImages(prevImages => [...prevImages, ...newImages]);
        setLoadMore(totalHits >= page * perPage);
      } catch (error) {
        console.log('error', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (query && (page === 1 || page > 1)) {
      loadImages();
    }
  }, [query, page, perPage]);

  const handleFormSubmit = newQuery => {
    if (query === newQuery) return;

    setQuery(newQuery);
    setPage(1);
    setImages([]);
  };

  const handleImageClick = image => {
    setShowImage(image);
  };

  const closeModal = () => {
    setShowImage(null);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <>
      <Searchbar onSubmit={handleFormSubmit} />
      <section className={styles.gallery}>
        <ImageGallery images={images} onImageClick={handleImageClick} />
        {isLoading && <Loader />}
        {!isLoading && loadMore && (
          <Button onClick={handleLoadMore}>Load more</Button>
        )}
        {showImage && (
          <Modal
            onClose={closeModal}
            src={showImage.largeImageURL}
            alt={showImage.tags}
          />
        )}
      </section>
      {error && <p>{error}</p>}
    </>
  );
};

export default App;
