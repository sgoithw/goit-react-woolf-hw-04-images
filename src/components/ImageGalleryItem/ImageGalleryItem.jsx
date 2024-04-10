import styles from './ImageGalleryItem.module.css';

const ImageGalleryItem = ({ src, alt, onImageClick }) => (
  <li className={styles.galleryItem}>
    <img src={src} alt={alt} onClick={onImageClick} />
  </li>
);

export default ImageGalleryItem;
