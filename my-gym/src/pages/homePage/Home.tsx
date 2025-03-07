import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import style from "./Home.module.css";

function Home() {
  const navigate = useNavigate(); // Hook for navigation
  const [qrCode, setQrCode] = useState<string>(""); // Store scanned QR code
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
                {
                  method: 'GET'
                }
              );
              const data = await response.json();
              console.log(data);
              return data;
            } catch(err) {
              console.log(err)
            }
          }
          
          // You need to call the function
          findPlayer();
          // Or if you need to use the data
          // findPlayer().then(data => { /* do something with data */ });
          
        } else {
          return;
        }
  
        setQrCode(""); // Clear the stored value after logging
      } 
      // Ensure only valid QR codes are built
      else {
        // If the first character doesn't match, reset
        if (qrCode.length === 0 && event.key !== "d") {
          console.log("❌ Invalid start. Ignoring input.");
          return; // Ignore invalid starting key
        }
  
        // Enforce correct prefix
        if (qrCode.length < requiredPrefix.length) {
          if (event.key !== requiredPrefix[qrCode.length]) {
            console.log("❌ Prefix mismatch. Resetting input.");
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
          {/* <button
            className={style.homeButtonItem}
            type="button"
            onClick={() => navigate("/RenewSubscription")}
          >
            تجديد الأشتراك
          </button> */}

          <button
            className={style.homeButtonItem}
            type="button"
            onClick={() => navigate("/NewSubscription")}
          >
            إشتراك جديد
          </button>


          <button
            className={style.homeButtonItem}
            type="button"
            onClick={() => navigate("/PlayerQrcode")}
          >
            إشتراك جديد
          </button>

          
          <input className="homeInputItem" type="text" placeholder="بحث عن لاعب " />
        </form>
      </div>
      <Outlet />
    </div>
  );
}

export default Home;
