import { Asset } from '../../../models/asset';

interface Props {
  images: Asset['images'];
}

/**
 * This component holds a carousel of images in a large size for display.
 */
const Gallery = ({ images }: Props) => {
  return (
    <div id='carouselExample' className='carousel slide'>
      <div className='carousel-inner'>
        {images &&
          images.map((image, index) => (
            <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
              <img
                src={image}
                className='d-block w-100 img-thumbnail mx-auto'
                alt={`Slide ${index + 1}`}
                style={{ maxWidth: '50%', height: 'auto' }}
              />
            </div>
          ))}
      </div>
      <button className='carousel-control-prev' type='button' data-bs-target='#carouselExample' data-bs-slide='prev'>
        <span className='carousel-control-prev-icon' aria-hidden='true'></span>
        <span className='visually-hidden'>Previous</span>
      </button>
      <button className='carousel-control-next' type='button' data-bs-target='#carouselExample' data-bs-slide='next'>
        <span className='carousel-control-next-icon' aria-hidden='true'></span>
        <span className='visually-hidden'>Next</span>
      </button>
    </div>
  );
};

export default Gallery;
