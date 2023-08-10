


import { motion } from "framer-motion";
import { TypingText} from "../components";
import { TypingText2} from "../components";
import styles from "../styles/";

import { fadeIn, staggerContainer } from "../utils/motion";

const About = () => (
  <section className={`${styles.paddings} relative z-10 `}>
    <div className="gradient-02 z-0" />
    <motion.div
      variants={staggerContainer}
      initial="hidden"  
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className={`${styles.innerWidth} mx-auto ${styles.flexCenter} flex-col`}
    >
      <TypingText2 title="@DT Team" textStyles="text-center" className="titleTeam"/>
      <TypingText title="@Solana Crowdfunding" textStyles="text-center" className="title"/>
      <motion.p  variants={fadeIn("up", "tween", 0.2, 1)}
        className="mt-[8px] font-normal sm:text-[32px] text-[20px] text-center text-black">
        eliminates geographical barriers, enabling global participation. Anyone
        with an internet connection can contribute to projects and support
        initiatives, fostering a more inclusive and diverse crowdfunding
        ecosystem.
      </motion.p>

 

      <motion.img
        variants={fadeIn("up", "tween", 0.3, 1)}
        src="/arrow-down.svg"
        alt="arrow down"
        className="w-[18px] h-[28px] object-contain mt-[28px]"
      />
    </motion.div>
  </section>
);

export default About;
