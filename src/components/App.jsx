import { Component } from 'react';
import { searchImages } from '../services/pixabayApi';

import styles from './App.module.css';

import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import Button from './Button/Button';
import Modal from './Modal/Modal';

class App extends Component {
  state = {
    images: [],
    loadMore: false,
    perPage: 12,
    query: '',
    page: 1,
    isLoading: false,
    showImage: null,
    error: null,
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.query !== this.state.query ||
      prevState.page !== this.state.page
    ) {
      this.loadImages({
        query: this.state.query,
        page: this.state.page,
      });
    }
  }

  loadImages = async ({ query, page = 1 }) => {
    this.setState({
      isLoading: true,
      loadMore: false,
      error: null,
    });

    try {
      const {
        data: { hits: images, totalHits },
      } = await searchImages({
        query,
        page,
        per_page: this.state.perPage,
      });

      this.setState(prevState => ({
        images: [...prevState.images, ...images],
        loadMore: totalHits >= page * this.state.perPage,
      }));
    } catch (error) {
      console.log('error', error);
      this.setState({ error: error.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  showImage = image => {
    this.setState({ showImage: image });
  };

  closeModal = () => {
    this.setState({ showImage: null });
  };

  loadMore = () => {
    this.setState({
      page: this.state.page + 1,
    });
  };

  handleFormSubmit = ({ query }) => {
    if (this.state.query === query) return;

    this.setState({
      query,
      page: 1,
      images: [],
    });
  };

  render() {
    return (
      <>
        <Searchbar onSubmit={this.handleFormSubmit} />
        <section className={styles.gallery}>
          <ImageGallery
            images={this.state.images}
            onImageClick={this.showImage}
          />
          {this.state.isLoading && <Loader />}
          {!this.state.isLoading && this.state.loadMore && (
            <Button onClick={this.loadMore}>Load more</Button>
          )}
          {this.state.showImage && (
            <Modal
              onClose={this.closeModal}
              src={this.state.showImage.largeImageURL}
              alt={this.state.showImage.tags}
            />
          )}
        </section>
        {this.state.error && <p>{this.state.error}</p>}
      </>
    );
  }
}

export default App;
