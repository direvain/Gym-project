import React, { useRef } from "react";
import style from './playerQrcode.module.css';
import { QRCode } from 'react-qrcode-logo';
import html2canvas from "html2canvas";
export function PlayerQrcode(props:any) {
    // Specify the correct type for the ref
    const cardRef = useRef<HTMLDivElement>(null);
  
    const saveAsImage = () => {
        // Check if ref exists and has current value
        if (cardRef.current) {
            // Add a slight delay to ensure QR code is fully rendered
            setTimeout(() => {
                // Use a non-null assertion to tell TypeScript that cardRef.current is definitely not null here
                html2canvas(cardRef.current as HTMLElement, { 
                    scale: 2,
                    useCORS: true, // Allow cross-origin images
                    logging: false,
                    backgroundColor: null
                }).then((canvas) => {
                    const link = document.createElement("a");
                    link.href = canvas.toDataURL("image/png");
                    link.download = `${props.value}.png`;
                    document.body.appendChild(link); // Append to body for Firefox support
                    link.click();
                    document.body.removeChild(link); // Clean up
                }).catch(error => {
                    console.error("Error generating image:", error);
                });
            }, 100);
        }
    };

    return (
        <div className={style.card}>
            '
            <div ref={cardRef} className={style.PlayerViewContainer}  
            style={{ 
                backgroundImage: 'url("qrcodeWallpaper.png")', // Add your image path here
                backgroundSize: 'cover', // Adjust as needed
                backgroundPosition: 'center', // Adjust as needed
                backgroundRepeat: 'no-repeat', // Adjust as needed
                backgroundColor:'#272424'
            }}
            >
                <img 
                    src="city_Gym_Icon.png" 
                    alt="My Gym Logo" 
                    className={style.PlayerViewLogo}
                    crossOrigin="anonymous" // Add cross-origin attribute for external images
                />
                <br/><br/>
                <QRCode 
                    value={props.value} 
                    ecLevel='L'
                    size={180}
                    fgColor='#000'
                    bgColor='#fff'
                    quietZone={10}
                    removeQrCodeBehindLogo={true}
                />
                <br/>
                <label className={style.playerLabel}>{props.name}</label>
                <label className={style.playerLabel}>{props.date}</label>
            </div>
            <button onClick={saveAsImage} className={style.saveButton}>
                Save as Photo
            </button>
            
        </div>
    );
}