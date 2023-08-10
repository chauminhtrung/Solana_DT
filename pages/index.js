/*eslint quotes: ["error", "double"]*/
/*eslint-env es6*/
import { useRef, useState } from "react";
import { Footer, Navbar } from "../components";
import {
  About,
  Explore,
  Feedback,
  GetStarted,
  Hero,
  Insights,
  WhatsNew,
  World,

} from "../sections";




const Home = () => {
  const [wallet, setWallet] = useState(null);
  const fieldRef = useRef(null);

  return (
    <div className="bg-primary-black h-screen">
      <Navbar wallet={wallet} setWallet={setWallet} />
      
      <Hero fieldRef={fieldRef} />
      <div className="relative">
        <About /> 
      
      </div>
      <div className="relative overflow-hidden ">
        
        <Insights wallet={wallet} fieldRef={fieldRef} />
        <div className="gradient-04 z-0 " />
      
      </div>


    


      {/* <World />
    
      <Footer /> */}
    </div>
  );
};

export default Home;
