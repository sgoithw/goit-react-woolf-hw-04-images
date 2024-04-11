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
    currentQuery: {
      query: '',
      page: 1,
    },
    isLoading: false,
    showImage: null,
    error: null,
  };

  componentDidMount() {
    this.loadImages({ query: '' });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.currentQuery.query !== this.state.currentQuery.query ||
      prevState.currentQuery.page !== this.state.currentQuery.page ||
      prevState.currentQuery.perPage !== this.state.currentQuery.perPage
    ) {
      this.loadImages(this.state.currentQuery);
    }
  }

  loadImages = async ({ query, page = 1 }) => {
    if (this.state.isLoading) return;

    this.setState({
      isLoading: true,
      images: page === 1 ? [] : this.state.images,
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
        isLoading: false,
        currentQuery: {
          query,
          page,
        },
      }));
    } catch (error) {
      console.log('error', error);
      this.setState({ error: error.message, isLoading: false });
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
      currentQuery: {
        ...this.state.currentQuery,
        page: this.state.currentQuery.page + 1,
      },
    });
  };

  handleFormSubmit = ({ query }) => {
    if (this.state.currentQuery.query === query) return;

    this.setState({
      currentQuery: {
        query,
        page: 1,
      },
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
