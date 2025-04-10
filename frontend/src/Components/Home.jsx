import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";

const products = [
  { id: 1, image: "home1.jpg", name: "Product 1" },
  { id: 2, image: "home2.jpg", name: "Product 2" },
  { id: 3, image: "home3.jpg", name: "Product 3" },
  { id: 4, image: "home4.jpg", name: "Product 4" },
];

const Home = () => {
  const [swiperInstance, setSwiperInstance] = useState(null);

  // Function to get autoplay settings based on screen size
  const getAutoplaySettings = () => {
    return window.innerWidth <= 768 ? false : { delay: 3000 };
  };

  // Effect to update autoplay settings on resize
  useEffect(() => {
    const handleResize = () => {
      if (!swiperInstance) return; // Prevent errors if swiperInstance is null

      if (window.innerWidth <= 768) {
        swiperInstance?.autoplay?.stop?.(); // Stop autoplay if it exists
      } else {
        swiperInstance?.autoplay?.start?.(); // Start autoplay if it exists
      }
    };

    // Run once when component mounts
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [swiperInstance]); // Runs when swiperInstance changes

  return (
    <div className="w-full md:h-screen">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={getAutoplaySettings()}
        className="w-full h-full"
        onSwiper={(swiper) => setSwiperInstance(swiper)}
      >
        {products.map((product) => (
          <SwiperSlide
            key={product.id}
            className="flex justify-center items-center"
          >
            <div className="w-full md:h-full flex justify-center items-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full md:h-auto object-cover md:h-full md:w-full"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Home;
