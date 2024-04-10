import styles from './Modal.module.css';
import { Component } from 'react';

class Modal extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = event => {
    if (event.code === 'Escape') {
      this.props.onClose();
    }
  };

  handleClose = event => {
    if (event.currentTarget === event.target) {
      this.props.onClose();
    }
  };

  render() {
    const { src, alt, onClose } = this.props;
    return (
      <div className={styles.overlay} onClick={this.handleClose}>
        <div className={styles.modal}>
          <img src={src} alt={alt} />
        </div>
      </div>
    );
  }
}

export default Modal;
