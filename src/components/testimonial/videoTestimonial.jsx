'use client'
import React, { useState } from 'react'
import ModalVideo from 'react-modal-video';
const VideoTestimonial = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <div className="video">
        <div className="position-relative">
          <img src="/images/testimonail/Rectangle2.png" alt="img" className="video_thumb" />
          <div onClick={() => setOpen(true)} className="video_icon video-play">
            <img src="/images/testimonail/Frame_20.svg" alt="img" />
          </div>
        </div>
      </div>
      <ModalVideo
        channel="youtube"
        youtube={{ mute: 0, autoplay: 0 }}
        isOpen={isOpen}
        videoId="oGoXhif0fNM"
        onClose={() => setOpen(false)}
      />
    </>
  )
}

export default VideoTestimonial