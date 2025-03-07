import React, { useRef, useState } from "react";
import style from './playerQrcode.module.css';
import { QRCode } from 'react-qrcode-logo';
import html2canvas from "html2canvas";

interface PlayerQrcodeProps {
    value: string;
    name: string;
    startDate: string;
    endDate: string;
    age: string;
    weight: string;
    phoneNumber: string;
    downloadName: string;
    onDownloadComplete: () => void; // Callback to notify when download is complete
}

export function PlayerQrcodeInfo({ value, downloadName, name, endDate, startDate,  onDownloadComplete, age, weight, phoneNumber }: PlayerQrcodeProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isPopping, setIsPopping] = useState(false); // State for pop animation
    const [isLoading, setIsLoading] = useState(false); // State for loading
    const [isUpdating, setIsUpdating] = useState(false); // State for showing input field
    const [newDate, setNewDate] = useState(endDate); // State for new date

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
                }).then((canvas) => {
                    const link = document.createElement("a");
                    link.href = canvas.toDataURL("image/png");
                    link.download = `${downloadName}.png`;
                    document.body.appendChild(link); // Append to body for Firefox support
                    link.click();
                    document.body.removeChild(link); // Clean up
                }).catch((error) => {
                    console.error("Error generating image:", error);
                }).finally(() => {
                    setIsLoading(false); // Stop loading
                    setIsPopping(false); // Stop pop animation
                    onDownloadComplete(); // Notify parent component that download is complete
                });
            }, 100); // Delay for the animation to start
        }
    };

    const updateSubscrition = () => {
        if (isUpdating) {
            // Call API to update the date
            fetch('/api/updateDate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ date: newDate }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Date updated successfully:', data);
                // Optionally handle success (e.g., show a message to the user)
            })
            .catch(error => {
                console.error('Error updating date:', error);
                // Optionally handle error (e.g., show an error message to the user)
            });
        }
        setIsUpdating(!isUpdating); // Toggle the input field visibility
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewDate(e.target.value); // Update the new date state
    };

    return (
        <div className={`${style.card} ${isPopping ? style.popAnimation : ''}`}>
            <div
                ref={cardRef}
                className={style.PlayerViewContainer}
                style={{
                    backgroundImage: 'url("./images/qrcodeWallpaper.png")', // Add your image path here
                    backgroundColor: '#000',
                }}
            >
                <img
                    src="./images/city_Gym_Icon.png"
                    alt="My Gym Logo"
                    className={style.PlayerViewLogo}
                    crossOrigin="anonymous" // Add cross-origin attribute for external images
                />
                <br />
                <QRCode
                    value={value || "Unknown"}
                    ecLevel="L"
                    size={130}
                    fgColor="#000"
                    bgColor="#ffb01d"
                    quietZone={10}
                    removeQrCodeBehindLogo={true}
                />
                <br />
                <label className={style.playerLabel}>{name || "No Name"}</label>
                <label className={style.playerLabel}>{weight || "No weight"}</label>
                <label className={style.playerLabel}>{age || "No age"}</label>
                <label className={style.playerLabel}>{phoneNumber || "No phone Number"}</label>
                <label className={style.playerLabel}>{`${startDate} - ${endDate}` || "No Date"}</label>

                <div className={style.buttonsplit}>
                <button onClick={saveAsImage} className={`${style.saveButton}`} disabled={isLoading}>
                    {isLoading ? "جاري الحفظ..." : "حفظ الصورة"}
                </button>
                <button className={`${style.saveButton}`} onClick={updateSubscrition}>
                {isUpdating ? "إلغاء" : "تجديد الاشتراك"}
                </button>
            </div>
            {isUpdating && (
                <div className={style.inputContainer}>
                    <input
                        type="text"
                        value={newDate}
                        onChange={handleDateChange}
                        placeholder="Enter new date"
                        className={style.dateInput}
                    />
                    <button  className={`${style.saveButton}`} >تاكيد</button>
                </div>
            )}
            </div>
        </div>
    );
}
