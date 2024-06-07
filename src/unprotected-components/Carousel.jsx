import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import CircularProgress from "@mui/material/CircularProgress";

const ImageCarousel = ({ images }) => {
  const carouselRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState([]);

  useEffect(() => {
    setLoading(true); // Set loading to true when starting to fetch images
    const loadImages = async () => {
      try {
        const promises = images.map((src) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(src);
            img.onerror = () => reject(new Error("Failed to load image"));
          });
        });

        const loaded = await Promise.all(promises);
        setLoadedImages(loaded);
      } catch (error) {
        console.error("Error loading images:", error);
      } finally {
        setLoading(false); // Set loading to false when all images are loaded or an error occurs
      }
    };

    loadImages();
  }, [images]);

  useEffect(() => {
    const handleScroll = (event) => {
      if (event.deltaY > 0) {
        carouselRef.current.next();
      } else {
        carouselRef.current.prev();
      }
    };

    if (carouselRef.current && carouselRef.current.wrapperRef) {
      const carouselNode = carouselRef.current.wrapperRef;
      carouselNode.addEventListener("wheel", handleScroll);

      return () => {
        carouselNode.removeEventListener("wheel", handleScroll);
      };
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <CircularProgress />
      </div>
    );
  }

  return (
    <Carousel
      ref={carouselRef}
      showThumbs={true}
      showArrows={true}
      showIndicators
      showStatus
      infiniteLoop
      useKeyboardArrows
      autoPlay
      stopOnHover
      swipeable
      renderIndicator={(onClickHandler, isSelected, index, label) => {
        const classNames = isSelected
          ? "mx-2 text-black cursor-pointer"
          : "mx-2 text-white cursor-pointer";
        return (
          <span
            className={classNames}
            onClick={onClickHandler}
            onKeyDown={onClickHandler}
            value={index}
            key={index}
            role="button"
            tabIndex={0}
            aria-label={`${label} ${index + 1}`}
          >
            •
          </span>
        );
      }}
    >
      {loadedImages.map((image, index) => (
        <div key={index}>
          <img src={image} alt={`Slide ${index}`} />
        </div>
      ))}
    </Carousel>
  );
};

ImageCarousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ImageCarousel;
