"use client";

import SlideUp from "@/utils/animations/slideUp";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper } from "swiper/react";

// Import Swiper styles
import { ManifestDetailsProps } from "@/db/manifest/manifestData";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ManifestDetails = ({
  id,
  title,
  description,
  subDescription,
  img,
}: ManifestDetailsProps) => {
  return (
    <section className="tools__concept" id={id}>
      <div className="container">
        <div className="projects__usecase">
          <div className="row align-items-center">
            <SlideUp className="col-lg-6">
              <div className="projects__usecase_content">
                <h3 className="t__54">{title}</h3>
                <p className="pt__50">{description}</p>
                <p className="para2">{subDescription}</p>
              </div>
            </SlideUp>
            <SlideUp delay={2} className="col-lg-6 mt-5 mt-lg-0">
              <div className="spaces__carousel">
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={0}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  loop={true}
                  className="spaces-swiper"
                >
                  <img
                    src={img}
                    alt={`${title} - image ${id}`}
                    className="spaces__carousel_img"
                  />
                </Swiper>
              </div>
            </SlideUp>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManifestDetails;
