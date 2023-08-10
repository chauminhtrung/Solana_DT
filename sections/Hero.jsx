"use client";

import { motion } from "framer-motion";

import styles from "../styles";
import { slideIn, staggerContainer, textVariant } from "../utils/motion";

const Hero = ({ fieldRef }) => (
  <section className={`${styles.yPaddings} sm:pl-16 pl-6`}>
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className={`${styles.innerWidth} mx-auto flex flex-col`}
    >
      <div className="flex justify-center items-center text-center flex-col relative z-10 mb-16">
        <motion.h1
          variants={textVariant(1.1)}
          className={`${styles.heroHeading}`}
        >
          <span className="font-extrabold  bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Empower{" "}
          </span>
          <span className="font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Dreams,{" "}
          </span>
         
          <span className="font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Change{" "}
          </span>{" "}
          <span className="font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Lives{" "}
          </span>{" "}
          
        </motion.h1>
      </div>

      <div className="relative w-full md:-mt-[20px] -mt-[12px]">
        <div className="absolute " />
        <video
          autoPlay
          loop
          muted
          playsInline
          src="/video.mp4"
          className="w-full sm:h-[500px] h-[350px] object-cover rounded-tl-[140px] z-10 relative"
        />
        <div className="absolute w-full sm:h-[500px] h-[350px] rounded-tl-[140px] top-0 left-0 flex justify-center items-center z-20 bg-black bg-opacity-40">
          <a
            href="#_"
            class="relative px-6 py-3 font-bold text-white rounded-lg group"
            onClick={() => {
              fieldRef.current.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span class="absolute inset-0 w-full h-full transition duration-300 transform -translate-x-1 -translate-y-1 bg-purple-800 ease opacity-80 group-hover:translate-x-0 group-hover:translate-y-0"></span>
            <span class="absolute inset-0 w-full h-full transition duration-300 transform translate-x-1 translate-y-1 bg-pink-800 ease opacity-80 group-hover:translate-x-0 group-hover:translate-y-0 mix-blend-screen"></span>
            <span class="relative text-4xl">Explore Now</span>
          </a>
        </div>
        <a href="#explore">
          <div className="w-full flex justify-end sm:-mt-[70px] -mt-[50px] pr-[40px] relative z-10"></div>
        </a>
      </div>
    </motion.div>
  </section>
);

export default Hero;
