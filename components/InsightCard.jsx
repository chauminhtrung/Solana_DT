import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

import { fadeIn } from '../utils/motion';

const InsightCard = ({ imgUrl, title, subtitle, index }) => {
  const [buttonWidth, setButtonWidth] = useState('auto');

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
    
      if (screenWidth < 768) {
        setButtonWidth('100%');
      } else if (screenWidth < 1024) {
        setButtonWidth('50%');
      } else {
        setButtonWidth('auto');
      }
    };


    window.addEventListener('resize', handleResize);
   
    handleResize();

   
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleClick = () => {
    console.log('Donate');
  };

  return (
    <motion.div
      variants={fadeIn('up', 'spring', index * 0.5, 1)}
      className="flex md:flex-row flex-col gap-4"
    >
      <img
        src={imgUrl}
        alt="planet-01"
        className="md:w-[270px] w-full h-[250px] rounded-[32px] object-cover"
      />
      <div className="w-full flex justify-between items-center">
        <div className="flex-1 md:ml-[62px] flex flex-col max-w-[650px]">
          <h4 className="font-normal lg:text-[42px] text-[26px] text-white">
            {title}
          </h4>
          <p className="mt-[16px] font-normal lg:text-[20px] text-[14px] text-secondary-white">
            {subtitle}
          </p>
        </div>

        <div
          className="lg:flex hidden items-center justify-center w-[100px] h-[100px] rounded-full bg-transparent"
        >
          <button
            type="button"
            className="flex items-center h-fit py-4 px-6 bg-[#25618B] rounded-[32px] gap-[12px]"
            style={{ width: buttonWidth }}
            onClick={handleClick}
          >
            <span className="font-normal text-[16px] text-white">
              Donate
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default InsightCard;
