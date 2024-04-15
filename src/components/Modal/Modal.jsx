import { useEffect } from 'react';
import styles from './Modal.module.css';

const Modal = ({ onClose, src, alt }) => {
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleKeyDown = event => {
    if (event.code === 'Escape') {
      onClose();
    }
  };

  const handleClose = event => {
    if (event.currentTarget === event.target) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal}>
        <img src={src} alt={alt} />
      </div>
    </div>
  );
};

export default Modal;
