import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { handleError } from '../../utils/utils';

import style from "./Home.module.css";
import { PlayerQrcodeInfo } from './../../components/PlayerQrcodeMang/PlayerQrcodeMang';

function Home() {
  const navigate = useNavigate(); 
  const [qrCode, setQrCode] = useState<string>(""); // Store scanned QR code
  const [showPlayerQrcode, setShowPlayerQrcode] = useState(false); // Renamed from PlayerQrcodeInfo
  const [qrData, setQrData] = useState({ 
    value: "", 
    name: "", 
    startDate: "",
    endDate: "",
    age: "", 
    weight: "",
    phoneNumber: "",
    downloadName: ""  
  });
  
  const requiredPrefix = "direvain"; // Define required QR prefix
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent default Enter behavior
        
        if (qrCode.startsWith(requiredPrefix)) {
          console.log("✅ Valid QR Code:", qrCode); // Process valid QR code
          
          const findPlayer = async () => {
            try {
              const response = await fetch(
                `http://localhost:8080/Members/SearchforMembers/${qrCode}`,
                { method: "GET" }
              );
              const result = await response.json();   
              if (response.ok) {
                setQrData({
                  value: result.qrCodeValue,
                  name: result.name,
                  startDate: result.subscriptionDurationStart,
                  endDate: result.subscriptionDurationEnd,
                  age: result.age,
                  weight: result.weight,
                  phoneNumber: result.phoneNumber,
                  downloadName: result.name,
                });
                setShowPlayerQrcode(true); // Changed from setPlayerQrcode
              } else {
                handleError("لا يوجد لاعب");
                setShowPlayerQrcode(false);
              }
            } catch(err) {
              setShowPlayerQrcode(false);
            }
          };
          
          findPlayer();
        } else {
          handleError("لا يوجد لاعب");
          return;
        }
  
        setQrCode(""); // Clear the stored value after processing
      } 
      // Ensure only valid QR codes are built
      else {
        // If the first character doesn't match, reset
        if (qrCode.length === 0 && event.key !== "d") {
          return; // Ignore invalid starting key
        }
  
        // Enforce correct prefix
        if (qrCode.length < requiredPrefix.length) {
          if (event.key !== requiredPrefix[qrCode.length]) {
            setQrCode(""); // Reset input
            return;
          }
        }
  
        // Append key input if valid
        setQrCode((prev) => prev + event.key);
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
  
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [qrCode]); // Depend on qrCode to update correctly
  
  const handleDownloadComplete = () => {
    setShowPlayerQrcode(false); // Hide the card after download
  };

  return (
    <div>
      <img
        className={style.homeImg}
        src="./images/city_Gym_Icon.png"
        alt="My Gym Logo"
        width="200"
        height="200"
      />

      <div className={style.Containerr}>
        <form>
          <button
            className={style.homeButtonItem}
            type="button"
            onClick={() => navigate("/NewSubscription")}
          >
            إشتراك جديد
          </button>
          <input className="homeInputItem" type="text" placeholder="بحث عن لاعب " />
        </form>
      </div>
      <div>
        <div>
          {showPlayerQrcode && (
            <div>
              <PlayerQrcodeInfo 
                onclose={handleDownloadComplete}
                value={qrData.value} 
                name={qrData.name}
                startDate={qrData.startDate} 
                endDate={qrData.endDate}
                age={qrData.age}
                weight={qrData.weight}
                phoneNumber={qrData.phoneNumber} 
                downloadName={qrData.name}
                onDownloadComplete={handleDownloadComplete}
              />
            </div>
          )}
        </div>
      </div>      
      <ToastContainer />     
      <Outlet />
    </div>
  );
}

export default Home;
