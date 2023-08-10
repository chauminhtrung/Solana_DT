import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Image from "../public/Amnesty.jpg";
import toast, { Toaster } from "react-hot-toast";

var check = false;

EventCLockWork.propTypes = {};
const Cards = ({ campaign, wallet }) => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [explorerUrl, setExplorerUrl] = useState("");
  const [donate, setDonate] = useState(false);
  const [showExplore, setShowExplore] = useState("");

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [inputDate, setInputDate] = useState("11 August 2023");
  const [currentDate, setCurrentDate] = useState("11 August 2023");

  useEffect(() => {
    const changingDate = new Date(inputDate);
    const currentDate = new Date();
    const totalSeconds = (changingDate - currentDate) / 1000;

    setDays(formatTime(Math.floor(totalSeconds / 3600 / 24)));
    setHours(Math.floor(totalSeconds / 3600) % 24);
    setMinutes(Math.floor(totalSeconds / 60) % 60);
    setSeconds(Math.floor(totalSeconds % 60));
  }, [currentDate]);

  function formatTime(time) {
    return time < 10 ? `0${time}` : time;
  }

  useEffect(() => {
    async function fetchData() {
      getBalances(wallet);
    }
    setTimeout(() => {
      fetchData();
    }, 1210);
    if (explorerUrl) setExplorerUrl("");
  }, [wallet]);

  const updateRaisedInDB = async (id) => {
    // find the registry in the database that contains the "id" and update the "raised" field
    const docRef = doc(db, "campaigns", id.split("-")[0]);
    getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        let userCampaigns = docSnap.data().userCampaigns;
        for (let i = 0; i < userCampaigns.length; i++) {
          if (userCampaigns[i].id === id) {
            // add the amount to the raised field, no matter if it's 0, int or float rounded to 4 decimals
            userCampaigns[i].raised += parseFloat(amount);
            updateDoc(doc(db, "campaigns", id.split("-")[0]), {
              userCampaigns: userCampaigns,
            });
            break;
          }
        }
      }
    });
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

  const sendTransaction = async (reciever, amount) => {
    getBalances(wallet);
    try {
      if (balance < amount) {
        toast.error("Số Dư Ví Không Đủ");
        return;
      }
      const provider = window?.phantom?.solana;
      const connection = new Connection(
        clusterApiUrl(SOLANA_NETWORK),
        "confirmed"
      );

      const fromPubkey = new PublicKey(wallet);
      const toPubkey = new PublicKey(reciever.split("-")[0]);

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

      updateRaisedInDB(reciever);
      setShowExplore(reciever);

      // clear inputs

      setAmount("");
    } catch (error) {
      console.log(error);
      toast.error("Error al enviar la transacción");
    }
  };

  const handleSend = async (reciever, amount) => {
    console.log(reciever, amount);
    sendTransaction(reciever, amount);
    setDonate(false);
  };

  campaign.date = new Date(campaign.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-7 hover:transform hover:scale-105 transition duration-300 ease-in-out min-w-[370px]">
      <div className="relative aspect-w-3 aspect-h-2">
        <img
          src={campaign.Img}
          className="object-cover rounded-lg max-h-[250px] min-w-full"
          alt={campaign.Title}
        />
      </div>

      <h2 className="text-2xl font-bold mt-4 text-white">{campaign.Title}</h2>
      <p className="text-gray-300 mt-2">{campaign.Des}</p>
      <div className="flex justify-between items-center mt-4">
        <div>
          <p className="text-gray-400">
            <span className="text-purple-500 font-bold">Created by:</span>
            {campaign.Key.split("-")[0].slice(0, 4)}

            {campaign.Key.split("-")[0].slice(-4)}
          </p>

          <p className="text-gray-400">
            <span className="text-purple-500 font-bold">Date:</span>{" "}
            {campaign.Date}
          </p>
        </div>

        <div>
          <p className="text-gray-400">
            <span className="text-green-500 font-bold">Goal:</span> SOL{" "}
            {/* {campaign.goal} */}
          </p>
          <p className="text-gray-400">
            <span className="text-green-500 font-bold">Raised:</span> SOL{" "}
            {/* {campaign.raised.toFixed(3)} */}
          </p>
        </div>
      </div>

      <div className="mt-4">
        {donate && (
          // input for the amount
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="1 SOL = 585,000 VND"
              className="bg-white px-4 py-3 font-medium rounded-md w-full border border-slate-300 placeholder:opacity-60 mb-3 outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent animate-appear"
              value={amount}
              required
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        )}

        {!donate ? (
          <button
            className="bg-blue-500 hover:bg-blue-600 transition duration-300 ease-in-out text-white font-bold py-2 px-4 rounded-lg"
            onClick={() => {
              setDonate(true);
            }}
          >
            Donate
          </button>
        ) : (
          <button
            className="bg-green-500 hover:bg-green-600 transition duration-300 ease-in-out text-white font-bold py-2 px-4 rounded-lg"
            onClick={() => {
              if (amount === "") {
                toast.error("Vui Lòng Nhập Tiền");
                return;
              } else if (amount < 0) {
                toast.error("Nhập Đúng Số Tiền");
                return;
              }
              handleSend(
                "BeqetKvWe7HTRUDG9WZxHTikJXQMvYo8HTYpdpRa7N4i",
                amount
              );
              setTimeout(() => {
                check = true;
              }, 200);
            }}
          >
            Confirm
          </button>
        )}
        <p className="text-gray-400 text-right">
          <span className="font-bold md:text-[25px] text-[20px] font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {days}:{hours}:{minutes}:{seconds}
          </span>
        </p>
        {check ? (
          <a
            href={explorerUrl}
            target="_blank"
            className="text-white font-bold flex flex-col mt-3 bg-transparent px-4 py-2 rounded-lg hover:bg-white transition duration-300 ease-in-out animate-appear border border-green-500 hover:border-transparent"
          >
            <span className="text-green-500 font-bold">
              Giao Dịch Thành Công! <span className="text-white">🎉</span>{" "}
              <span className="text-blue-500">Xem Giao Dịch</span>
            </span>
          </a>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

const CampaignsList = ({ campaigns, wallet }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {campaigns.map(
        (campaign, index) => (
          // campaign["userCampaigns"].map((campaign) => (
          <Cards key={index} campaign={campaign} wallet={wallet} />
        )

        // ))
      )}
    </div>
  );
};

const ArrayListImage = [
  {
    Title: "Hỗ trợ Chiến dịch lũ lụt miền trung",
    Key: "BeqetKvWe7HTRUDG9WZxHTikJXQMvYo8HTYpdpRa7N4i",
    Date: "10 August,2023",
    Des: "Cung cấp cứu trợ, an toàn, thực phẩm và y tế cho những người bị thiên tai ảnh hưởng trong vùng Miền Trung, Việt Nam.",
    Img: "https://vtv1.mediacdn.vn/2020/10/19/fbimg1603036697728-16030985373361758672595.jpg",
  },
];

function EventCLockWork({ wallet }) {
  const [campaigns, setCampaigns] = useState([]);

  // read data from firestore collection

  return (
    <div className=" mx-auto py-8">
      <CampaignsList campaigns={ArrayListImage} wallet={wallet} />
    </div>
  );
}

export default EventCLockWork;
