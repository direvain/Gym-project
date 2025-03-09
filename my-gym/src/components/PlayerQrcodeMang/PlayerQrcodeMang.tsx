import React, { useRef, useState } from "react";
import style from './PlayerQrcodeMang.module.css';
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
    onDownloadComplete: () => void;
    onclose: () => void;
}

export function PlayerQrcodeInfo({ 
    value, 
    downloadName, 
    name, 
    endDate: initialEndDate, 
    startDate: initialStartDate, 
    onDownloadComplete, 
    age, 
    weight, 
    phoneNumber, 
    onclose
}: PlayerQrcodeProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isPopping, setIsPopping] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [newDate, setNewDate] = useState(initialEndDate);
    const [endDate, setEndDate] = useState(initialEndDate); // New state to track the current end date
    const [startDate, setstartDate] = useState(initialStartDate); // New state to track the current end date

    const saveAsImage = () => {
        if (cardRef.current) {
            setIsLoading(true);
            setIsPopping(true);

            setTimeout(() => {
                html2canvas(cardRef.current as HTMLElement, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    backgroundColor: null,
                }).then((canvas) => {
                    const link = document.createElement("a");
                    link.href = canvas.toDataURL("image/png");
                    link.download = `${downloadName}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }).catch((error) => {
                    console.error("Error generating image:", error);
                }).finally(() => {
                    setIsLoading(false);
                    setIsPopping(false);
                    onDownloadComplete();
                });
            }, 100);
        }
    };

    const updateSubscription = () => {
        setIsUpdating(!isUpdating);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewDate(e.target.value);
    };

    const handleSubmitUpdate = async () => {
        try {
            const response = await fetch('http://localhost:8080/Members/updateSubscription', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    value: value,
                    date: newDate 
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to update subscription");       
            }
            setEndDate(newDate);
            setstartDate(result.subscriptionDurationStart);
            setIsUpdating(false);
            
        } catch(error: unknown) {
            if (error instanceof Error) {
                console.error("Error:", error.message);
            } 
        }
    };

    const goBack = () => {
        onclose();
    };

    return (
        <div className={`${style.card} ${isPopping ? style.popAnimation : ''}`}
            style={{
                backgroundImage: 'url("./images/qrcodeWallpaper.png")',
                backgroundColor: '#000',
            }}
        >
            <img src="./images/cancel.png" alt="Back" className={style.back_button} onClick={goBack} />
            <div
                ref={cardRef}
                className={style.PlayerViewContainer}
                style={{
                    backgroundImage: 'url("./images/qrcodeWallpaper.png")',
                    backgroundColor: '#000',
                }}
            >
                <img
                    src="./images/city_Gym_Icon.png"
                    alt="My Gym Logo"
                    className={style.PlayerViewLogo}
                    crossOrigin="anonymous"
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
                <label className={style.playerLabel}>{`الوزن: ${weight || "No weight"}`}</label>
                <label className={style.playerLabel}>{`العمر: ${age || "No age"}`}</label>
                <label className={style.playerLabel}>{`رقم الهاتف: ${phoneNumber || "No phone Number"}`}</label>
                <label className={style.playerLabel}>{`${startDate} - ${endDate}` || "No Date"}</label>
            </div>
            <div className={style.buttonsplit}>
                <button onClick={saveAsImage} className={`${style.saveButton}`} disabled={isLoading}>
                    {isLoading ? "جاري الحفظ..." : "حفظ الصورة"}
                </button>
                <button className={`${style.saveButton}`} onClick={updateSubscription}>
                    {isUpdating ? "إلغاء" : "تجديد الاشتراك"}
                </button>
            </div>
            {isUpdating && (
                <div className={style.inputContainer}>
                    <input
                        type="text"
                        value={newDate}
                        onChange={handleDateChange}
                        className={style.dateInput}
                    />
                    <button className={`${style.saveButton}`} onClick={handleSubmitUpdate}>تاكيد</button>
                </div>
            )}
        </div>
    );
}