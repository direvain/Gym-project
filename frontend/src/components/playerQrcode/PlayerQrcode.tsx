import React, { useRef, useState } from "react";
import style from './playerQrcode.module.css';
import { QRCode } from 'react-qrcode-logo';
import html2canvas from "html2canvas";
interface PlayerQrcodeProps {
    value: string;
    name: string;
    date: string;
    downloadName:string;
    onDownloadComplete: () => void; // Callback to notify when download is complete
  }

  export function PlayerQrcode({ value, downloadName, name, date, onDownloadComplete }: PlayerQrcodeProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isPopping, setIsPopping] = useState(false); // State for pop animation
    const [isLoading, setIsLoading] = useState(false); // State for loading
  
    const saveAsImage = () => {
      if (cardRef.current) {
        setIsLoading(true); // Start loading
        setIsPopping(true); // Start pop animation
  
        // Add a slight delay to ensure the animation is visible
        setTimeout(() => {
          html2canvas(cardRef.current as HTMLElement, {
            scale: 2,
            useCORS: true, // Allow cross-origin images
            logging: false,
            backgroundColor: null,
          })
            .then((canvas) => {
              const link = document.createElement("a");
              link.href = canvas.toDataURL("image/png");
              link.download = `${downloadName}.png`;
              document.body.appendChild(link); // Append to body for Firefox support
              link.click();
              document.body.removeChild(link); // Clean up
            })
            .catch((error) => {
              console.error("Error generating image:", error);
            })
            .finally(() => {
              setIsLoading(false); // Stop loading
              setIsPopping(false); // Stop pop animation
              onDownloadComplete(); // Notify parent component that download is complete
            });
        }, 100); // Delay for the animation to start
      }
    };
  
    return (
      <div className={`${style.card} ${isPopping ? style.popAnimation : ''}`}>
        <div
          ref={cardRef}
          className={style.PlayerViewContainer}
          style={{
            backgroundImage: 'url("qrcodeWallpaper.png")', // Add your image path here
            backgroundColor: '#000',
          }}
        >
          <img
            src="city_Gym_Icon.png"
            alt="My Gym Logo"
            className={style.PlayerViewLogo}
            crossOrigin="anonymous" // Add cross-origin attribute for external images
          />
          <br />
          <br />
          <QRCode
            value={value || "Unknown"}
            ecLevel="L"
            size={180}
            fgColor="#000"
            bgColor="#ffb01d"
            quietZone={10}
            removeQrCodeBehindLogo={true}
          />
          <br />
          <label className={style.playerLabel}>{name || "No Name"}</label>
          <label className={style.playerLabel}>{date || "No Date"}</label>
        </div>
        <button onClick={saveAsImage} className={style.saveButton} disabled={isLoading}>
          {isLoading ? "جاري الحفظ..." : "حفظ الصورة"}
        </button>
      </div>
    );
  }