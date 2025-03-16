import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { handleError } from '../../utils/utils';

import style from "./Home.module.css";
import { PlayerQrcodeInfo } from './../../components/PlayerQrcodeMang/PlayerQrcodeMang';

function Home() {
    const requiredPrefix = "direvain"; // Define required QR prefix

  const navigate = useNavigate(); 
  const [qrCode, setQrCode] = useState<string>(""); // Store scanned QR code
  const [showPlayerQrcode, setShowPlayerQrcode] = useState(false); // Renamed from PlayerQrcodeInfo
  const [showPlayerQrcodeName, setShowPlayerQrcodeName] = useState(false); // Renamed from PlayerQrcodeInfo
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
  const [qrDataPlayers, setqrDataPlayers] = useState({ 
    value: "", 
    name: "", 
    startDate: "",
    endDate: "",
    age: "", 
    weight: "",
    phoneNumber: "",
    downloadName: ""  
  });

    const { register, handleSubmit } = useForm({
      defaultValues: {
        playerName: "",
      },
    });

  const onSubmit = async  (values : any) => {
    if (!values.playerName) return handleError("اسم اللاعب مطلوب");
    try 
    {
      const response = await fetch(`http://localhost:8080/Members/SearchforMembersName/${values.playerName}`, {
        method: "get",
        headers: 
        {
          "Content-Type": "application/json",
        },});
        if(response.ok)
        {
          const result = await response.json();
          
          setqrDataPlayers({
            value: result[0].qrCodeValue,
            name: result[0].name,
            startDate: result[0].subscriptionDurationStart,
            endDate: result[0].subscriptionDurationEnd,
            age: result[0].age,
            weight: result[0].weight,
            phoneNumber: result[0].phoneNumber,
            downloadName: result[0].name,
          });
          
          setShowPlayerQrcode(false);

          setShowPlayerQrcodeName(true); // Changed from setPlayerQrcode

        }else {
          handleError("لا يوجد لاعب");
          setShowPlayerQrcodeName(false);
      }
        
    } 
    catch (error) 
    {
      handleError("لا يمكن الوصول الى قاعدة البيانات");
      setShowPlayerQrcodeName(false);

    }
  }

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
                setShowPlayerQrcodeName(false);
                setShowPlayerQrcode(true); // Changed from setPlayerQrcode

              } else {
                handleError("لا يوجد لاعب");
                setShowPlayerQrcode(false);
              }
            } catch(err) {
              handleError("لا يمكن الوصول الى قاعدة البيانات");
              setShowPlayerQrcode(false);
            }
          };
          
          findPlayer();
        } else {
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
    setShowPlayerQrcodeName(false); // Hide the card after download
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
        <form  onSubmit={handleSubmit(onSubmit)}>
          <button
            className={style.homeButtonItem}
            type="button"
            onClick={() => navigate("/NewSubscription")}
          >
            إشتراك جديد
          </button>
          <input className={style.homeInputItem} type="text" placeholder="بحث عن لاعب " {...register("playerName")} onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault(); // Prevent default form submission (optional)
        handleSubmit(onSubmit)(); // Manually trigger form submission
      }
    }} />
          
        </form>
      </div>
  
      {showPlayerQrcodeName && (
            <div>
              <PlayerQrcodeInfo 
                onclose={handleDownloadComplete}
                value={qrDataPlayers.value} 
                name={qrDataPlayers.name}
                startDate={qrDataPlayers.startDate} 
                endDate={qrDataPlayers.endDate}
                age={qrDataPlayers.age}
                weight={qrDataPlayers.weight}
                phoneNumber={qrDataPlayers.phoneNumber} 
                downloadName={qrDataPlayers.name}
                onDownloadComplete={handleDownloadComplete}
              />
            </div>
          )}
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
          
        
      
      <ToastContainer />     
      <Outlet />
    </div>
  );
}

export default Home;
