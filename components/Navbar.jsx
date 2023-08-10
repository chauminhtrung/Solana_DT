"use client";
import { motion } from "framer-motion";
import styles from "../styles";
import { navVariants } from "../utils/motion";
import { useEffect, useState } from "react";
import RegistrationForms from "./RegistrationForms";
import {
  Connection,
  SystemProgram,
  Transaction,
  PublicKey,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
  SendTransactionError,
} from "@solana/web3.js";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import { set } from "react-hook-form";

const SOLANA_NETWORK = "devnet";

const Navbar = ({ wallet, setWallet }) => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [balance, setBalance] = useState(0);
  const [reciever, setReciever] = useState("");
  const [amount, setAmount] = useState("");
  const [explorerUrl, setExplorerUrl] = useState("");
  const [scrolling, setScrolling] = useState(false);
  const router = useRouter();

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 0) {
        setScrolling(true);
      }
      if (window.scrollY === 0) {
        setScrolling(false);
      }
    });
  }

  useEffect(() => {
    // let key = window.localStorage.getItem("wallet");
    // setWallet(key);
    // if (key) getBalances(key);
    // if (explorerUrl) setExplorerUrl("");
    async function fetchData() {
      const provider = window?.phantom?.solana;
      const { solana } = window;
      let phantom;
      if (provider?.isPhantom) {
        phantom = provider;
      }

      const { publicKey } = await phantom.connect({ onlyIfTrusted: true });
      setWallet(publicKey.toString());
      toast.success("Wallet connected");
      getBalances(publicKey.toString());
    }
    setTimeout(() => {
      fetchData();
    }, 1000);
    if (explorerUrl) setExplorerUrl("");
  }, []);

  const handleRecieverChange = (e) => {
    setReciever(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const sendTransaction = async () => {
    try {
      getBalances(wallet);
      if (balance < amount) {
        toast.error("No tienes suficientes fondos");
        return;
      }
      const provider = window?.phantom?.solana;
      const connection = new Connection(
        clusterApiUrl(SOLANA_NETWORK),
        "confirmed"
      );

      const fromPubkey = new PublicKey(wallet);
      const toPubkey = new PublicKey(reciever);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPubkey;

      const transactionSignature = await provider.signTransaction(transaction);

      const txid = await connection.sendRawTransaction(
        transactionSignature.serialize()
      );

      const confirmation = await connection.confirmTransaction(txid, {
        commitment: "singleGossip",
      });

      const { slot } = confirmation.value;

      console.log("Transaction confirmed at slot", slot);

      const solanaExplorerUrl = `https://explorer.solana.com/tx/${txid}?cluster=${SOLANA_NETWORK}`;
      setExplorerUrl(solanaExplorerUrl);

      toast.success("Transaction confirmed at slot " + slot);

      getBalances(wallet);

      // clear inputs
      setReciever("");
      setAmount("");
    } catch (error) {
      console.log(error);
      toast.error("Error al enviar la transacción");
    }
  };

  const handleSend = async () => {
    console.log(reciever, amount);
    sendTransaction();
    setReciever("");
    setAmount("");
  };

  const signIn = async () => {
    const provider = window?.phantom?.solana;
    const { solana } = window;

    if (!provider?.isPhantom) {
      toast.error("Phantom wallet is not installed");
      setTimeout(() => {
        window.open("https://phantom.app/", "_blank");
      }, 2000);
      return;
    }

    let phantom;
    if (provider?.isPhantom) {
      phantom = provider;
    }

    const { publicKey } = await phantom.connect();
    console.log(publicKey.toString());
    setWallet(publicKey.toString());
    window.localStorage.setItem("wallet", publicKey.toString());
    toast.success("Wallet connected");

    getBalances(publicKey.toString());
  };

  const signOut = async () => {
    if (window) {
      const { solana } = window;
      window.localStorage.removeItem("wallet");
      setWallet(null);
      solana.disconnect();
    }
  };

  const getBalances = async (wallet) => {
    try {
      const connection = new Connection(
        clusterApiUrl(SOLANA_NETWORK),
        "confirmed"
      );
      const balance = await connection.getBalance(new PublicKey(wallet));
      const balanceInSol = balance / LAMPORTS_PER_SOL;
      setBalance(balanceInSol);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRegistrationClick = () => {
    setShowRegistrationForm(true);
  };

  return (
    <div
      className={`${
        styles.xPaddings
      } py-6 sticky top-0 z-50 transition-all duration-700 ${
        scrolling ? "bg-[#0F1A2F] shadow-lg shadow-slate-700" : ""
      }`}
    >
      <div className="absolute w-[50%] inset-0 gradient-01 z-20" />
      <div
        className={`${styles.innerWidth} relative mx-auto flex justify-between gap-8 z-50 items-center`}
      >
        <h1 className="font-normal text-3xl text-white flex gap-1">
          <span className="font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            SOL
          </span>
          <span className="text-white">Fund</span>
        </h1>

        {!wallet ? (
          <button
            type="button"
            className="flex items-center h-fit py-4 px-6 bg-purple-500 rounded-[32px] gap-[12px] hover:bg-purple-600 transition-all duration-300"
            onClick={signIn}
          >
            <span className="font-normal text-[16px] text-white">
              Connect Wallet
            </span>
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 flex-col bg-purple-500 px-3 py-2 rounded-xl hover:bg-purple-600 transition-all duration-300 hover:shadow-2xl">
              <span className="font-bold text-sm text-white flex gap-2 items-center justify-center ">
                <img
                  src="https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/sqzgmbkggvc1uwgapeuy"
                  alt="phantom logo"
                  className="w-[24px] h-[24px] object-contain"
                />
                {wallet.slice(0, 5)}...{wallet.slice(-5)}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-col bg-purple-400 px-3 py-2 rounded-xl hover:bg-purple-500 transition-all duration-300 hover:shadow-2xl">
              <span className="font-bold text-sm text-white flex gap-2 items-center justify-center ">
                <img
                  src="https://seeklogo.com/images/S/solana-sol-logo-12828AD23D-seeklogo.com.png"
                  alt="solana logo"
                  className="w-[24px] h-[24px] object-contain"
                />
                {balance.toFixed(2)} SOL
              </span>
            </div>
            <div className="w-[1px] h-[50px] bg-slate-500" />
            <button
              type="button"
              className="flex items-center h-fit py-4 px-6 bg-blue-600 rounded-2xl gap-[12px] hover:bg-blue-700 transition-all duration-300 hover:shadow-2xl"
              onClick={() => setShowRegistrationForm(true)}
            >
              <span className="font-bold text-white">Create Campaign</span>
            </button>
            <button
              type="button"
              className="flex items-center h-fit py-4 px-6 bg-purple-500 rounded-2xl gap-[12px] hover:bg-purple-600 transition-all duration-300 hover:shadow-2xl"
              onClick={signOut}
            >
              <span className="font-bold text-white">Disconnect</span>
            </button>
          </div>
        )}
      </div>
      <div className="relative w-full h-full inset-0 z-50 mt-5">
        {showRegistrationForm && (
          <RegistrationForms
            wallet={wallet}
            setShowRegistrationForm={setShowRegistrationForm}
          />
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default Navbar;
