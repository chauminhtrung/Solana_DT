"use client";

import { motion } from "framer-motion";

import styles from "../styles";
import { insights } from "../constants";
import { staggerContainer } from "../utils/motion";
import { InsightCard, TitleText, TitleText3, TypingText } from "../components";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
  collection,
} from "firebase/firestore";

import EventCLockWork from "../sections/EventCLockWork";

import { db } from "../firebase";
import { useEffect } from "react";
import CampaignCard from "../components/CampaignCard";

const Insights = ({ wallet, fieldRef }) => {
  // read data from firestore collection
  useEffect(() => {
    const data = onSnapshot(collection(db, "campaigns"), (snapshot) => {
      snapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
      });
    });

    return data;
  }, []);

  return (
    <div className={`${styles.paddings} relative z-10`} ref={fieldRef}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
        className={`${styles.innerWidth} mx-auto flex flex-col`}
      >
        <TypingText title="| Insight" textStyles="text-center" />

        <TitleText3 title={<>Important Event!</>} textStyles="text-center" />
        <div className="mt-[50px] flex flex-col gap-[30px]">
          <EventCLockWork wallet={wallet} />
        </div>

        <TitleText
          title={<>Change the World Now!</>}
          textStyles="text-center"
        />
        <div className="mt-[50px] flex flex-col gap-[30px]">
          <CampaignCard wallet={wallet} />
        </div>
      </motion.div>
    </div>
  );
};

export default Insights;
