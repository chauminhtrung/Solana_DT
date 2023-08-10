import React, { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
  collection,
  update,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import {
  Connection,
  SystemProgram,
  Transaction,
  PublicKey,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
  SendTransactionError,
} from "@solana/web3.js";

const SOLANA_NETWORK = "devnet";
var i = 0;
var check = false;

const Cards = ({ campaign, wallet }) => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [explorerUrl, setExplorerUrl] = useState("");
  const [donate, setDonate] = useState(false);
  const [showExplore, setShowExplore] = useState("");

  console.log(doc);
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

      const solanaExplorerUrl = `https://explorer.solana.com/tx/${txid}?cluster=${SOLANA_NETWORK}`;
      setExplorerUrl(solanaExplorerUrl);

      toast.success("Giao Dịch Thành Công " + slot);

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
            ...
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
              }, 10);
            }}
          >
            Confirm
          </button>
        )}
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
      <p className="text-[1px]">{i++}</p>
    </div>
  );
};

const ArrayListImage = [
  {
    Title: "Hỗ trợ Chiến dịch Doanh nhân Địa phương",
    Key: "BeqetKvWe7HTRUDG9WZxHTikJXQMvYo8HTYpdpRa7N4i",
    Date: "10 August,2023",
    Des: "Đẩy mạnh phát triển kinh tế tiểu thương trong cộng đồng",
    Img: "https://thumbs.dreamstime.com/b/commercial-activities-entrepreneur-opening-store-concept-owning-shop-becoming-owner-retail-property-flat-vector-227516941.jpg",
  },

  {
    Title: "Xe cứu thương miễn phí chở bệnh nhân nghèo",
    Key: "BeqetKvWe7HTRUDG9WZxHTikJXQMvYo8HTYpdpRa7N4i",
    Date: "10 August,2023",
    Des: "Giúp đỡ những cá nhân có hoàn cảnh khó khăn về tài chính được điều trị y tế quan trọng",
    Img: "https://i.pinimg.com/originals/92/76/53/927653da10520cddaf39691f0787b2f4.jpg",
  },

  {
    Title: "Chiến dịch tái trồng rừng",
    Key: "BeqetKvWe7HTRUDG9WZxHTikJXQMvYo8HTYpdpRa7N4i",
    Date: "10 August,2023",
    Des: "Góp phần bảo tồn môi trường bằng cách trồng cây",
    Img: "https://giaingo.info/wp-content/uploads/2021/07/4708875_Cover_Rung-768x476.jpg",
  },

  {
    Title: "Chiến dịch học bổng sinh viên",
    Key: "BeqetKvWe7HTRUDG9WZxHTikJXQMvYo8HTYpdpRa7N4i",
    Date: "10 August,2023",
    Des: "Hỗ trợ giáo dục học sinh tài năng và thúc đẩy sự phát triển của các em ở vùng sâu vùng xa",
    Img: "https://miles2give.org/wp-content/uploads/2019/12/hoc-sinh-vung-cao3.jpg",
  },

  {
    Title: "Chiến dịch bảo tồn động vật nguy cơ tuyệt chủng",
    Key: "BeqetKvWe7HTRUDG9WZxHTikJXQMvYo8HTYpdpRa7N4i",
    Date: "10 August,2023",
    Des: "bảo vệ và cung cấp nơi cứ trú cho động vật sắp tuyệt chủng",
    Img: "https://www.thiennhien.net/wp-content/uploads/2020/12/211220_tegiac.jpg",
  },

  {
    Title: "Chiến dịch Đại dương sạch",
    Key: "BeqetKvWe7HTRUDG9WZxHTikJXQMvYo8HTYpdpRa7N4i",
    Date: "10 August,2023",
    Des: "Chống ô nhiễm đại dương và bảo vệ sinh vật biển",
    Img: "https://alphalife.asia/wp-content/uploads/2020/03/o-nhiem-bien-va-dai-duong.jpg",
  },

  {
    Title: "Chiến dịch nâng cao nhận thức của giới trẻ",
    Key: "BeqetKvWe7HTRUDG9WZxHTikJXQMvYo8HTYpdpRa7N4i",
    Date: "10 August,2023",
    Des: "Tầm quan trọng của việc nhận thức của giới trẻ đối với xã hội hiện nay rất quan trọng",
    Img: "https://3.bp.blogspot.com/-3JGZFksZV-M/VYVKHy1hqFI/AAAAAAAB2gY/7RGamyp1YEQ/s1600/d.jpg",
  },

  {
    Title: "Sáng kiến ​​Vườn cộng đồng",
    Key: "BeqetKvWe7HTRUDG9WZxHTikJXQMvYo8HTYpdpRa7N4i",
    Date: "10 August,2023",
    Des: "Thành lập các khu vườn cộng đồng để thúc đẩy cuộc sống bền vững",
    Img: "http://www.westviewatlanta.com/wordpress/wp-content/uploads/2014/05/2014-04-26-community-garden-spring-planting-04.jpg",
  },

  {
    Title: "Hỗ trợ cho người cao tuổi",
    Key: "BeqetKvWe7HTRUDG9WZxHTikJXQMvYo8HTYpdpRa7N4i",
    Date: "10 August,2023",
    Des: "Cung cấp hỗ trợ và đồng hành với các thành viên cộng đồng cao tuổi",
    Img: "https://assets.rappler.com/612F469A6EA84F6BAE882D2B94A4B421/img/8C25B9F8BDF64B9CB6741F91104C9E03/100yearsoldget100thousand.jpg",
  },

  {
    Title: "Chiến dịch quảng bá văn hóa Việt Nam",
    Key: "BeqetKvWe7HTRUDG9WZxHTikJXQMvYo8HTYpdpRa7N4i",
    Date: "10 August,2023",
    Des: "Phát triển truyền thống văn hóa, tuyên truyền lan rộng văn hóa Việt Nam",
    Img: "https://vietnaminsider.vn/wp-content/uploads/2020/11/cultural-diplomacy.jpg",
  },

  {
    Title: "Sáng kiến năng lượng sạch",
    Key: "BeqetKvWe7HTRUDG9WZxHTikJXQMvYo8HTYpdpRa7N4i",
    Date: "10 August,2023",
    Des: "Thúc đẩy sử dụng các nguồn năng lượng sạch vì một tương lai bền vững",
    Img: "https://www.amwins.com/images/default-source/insights-images/wind-turbines---energy.jpg?sfvrsn=8a1058d5_1",
  },

  {
    Title: "Chiến dịch quyên góp cho phòng khám sức khỏe cộng đồng",
    Key: "BeqetKvWe7HTRUDG9WZxHTikJXQMvYo8HTYpdpRa7N4i",
    Date: "10 August,2023",
    Des: "Quyên góp để cung cấp dịch vụ chăm sóc sức khỏe tại các cộng đồng chưa được phục vụ",
    Img: "https://www.rasmussen.edu/-/media/images/blogs/school-of-health-sciences/2019/what-is-community-health.jpg",
  },

  {
    Title: "Chiến dịch bảo vệ trẻ em",
    Key: "BeqetKvWe7HTRUDG9WZxHTikJXQMvYo8HTYpdpRa7N4i",
    Date: "10 August,2023",
    Des: "Bảo vệ và lên án các hành động ảnh hưởng đến cuộc sống của trẻ em",
    Img: "https://cdn.cungcap.net/media/img/2019/05/14/bmQqB-1557824104.jpeg",
  },

  {
    Title: "Chiến dịch giúp đỡ người khuyết tật",
    Key: "BeqetKvWe7HTRUDG9WZxHTikJXQMvYo8HTYpdpRa7N4i",
    Date: "10 August,2023",
    Des: "Cung cấp việc làm tạo cuộc sống mới cho những người khuyết tật",
    Img: "https://hoanhap.vn/uploads/photos/20/4/5f517d1d9bc35.jpg",
  },

  {
    Title: "Chiến dịch cứu đói giảm nghèo",
    Key: "BeqetKvWe7HTRUDG9WZxHTikJXQMvYo8HTYpdpRa7N4i",
    Date: "10 August,2023",
    Des: "Phát triển các chương trình và dự án bền vững nhằm cải thiện điều kiện sống và nâng cao năng lực tự chủ của cộng động",
    Img: "https://image.sggp.org.vn/w560/Uploaded/2023/ctzdxljwq/2019_02_11/k12e_ELSZ.jpg",
  },
];

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

const CampaignCard = ({ wallet }) => {
  const [campaigns, setCampaigns] = useState([]);

  // read data from firestore collection
  useEffect(() => {
    const data = onSnapshot(collection(db, "campaigns"), (snapshot) => {
      setCampaigns([]);
      snapshot.forEach((doc) => {
        // @ts-ignore
        setCampaigns((campaigns) => [
          ...campaigns,
          { id: doc.id, ...doc.data() },
        ]);
      });
    });

    return data;
  }, []);

  return (
    <div className=" mx-auto py-8">
      <CampaignsList campaigns={ArrayListImage} wallet={wallet} />
    </div>
  );
};

export default CampaignCard;
