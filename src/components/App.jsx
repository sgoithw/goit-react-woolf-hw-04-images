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
    currentQuery: {},
    isLoading: false,
    showImage: null,
  };

  componentDidMount() {
    this.loadImages({ query: '' });
  }

  loadImages = async ({ query, page = 1 }) => {
    if (this.state.isLoading) return;

    this.setState({
      isLoading: true,
      images: page === 1 ? [] : this.state.images,
    });

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
  };

  showImage = image => {
    this.setState({ showImage: image });
  };

  closeModal = () => {
    this.setState({ showImage: null });
  };

  loadMore = () => {
    this.loadImages({
      ...this.state.currentQuery,
      page: this.state.currentQuery.page + 1,
    });
  };

  render() {
    return (
      <>
        <Searchbar onSubmit={this.loadImages} />
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
      </>
    );
  }
}

export default App;
