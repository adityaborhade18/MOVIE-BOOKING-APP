import { useState } from 'react';
import { dummyTrailers } from '../assets/assets.js';
import ReactPlayer from 'react-player';
import BlurCircle from './BlurCircle.jsx';

const TrailerSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden'>
      <p className='text-gray-300 font-medium text-lg max-w-[960px] mx-auto'>Trailers</p>

      <div className='relative mt-6'>
        <BlurCircle top='-100px' right='-100px' />

        
        <div className="w-full max-w-[960px] mx-auto">
           <ReactPlayer 
             url={currentTrailer.videoUrl}
             playing={false} 
             controls={true}
             width="100%"
             height="540px"
           />

        </div>
      </div>
    </div>
  );
};

export default TrailerSection;
