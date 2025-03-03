import React from "react";
import { useForm } from "react-hook-form";
import style from './NewSubscription.module.css';
import { handleError } from '../../utils/utils';
import { ToastContainer } from 'react-toastify';
import { PlayerQrcode } from "../../components/playerQrcode/PlayerQrcode";

export function NewSubscription() {

  
  const [playerQrcode, setPlayerQrcode] = React.useState(false);
  const [qrData, setQrData] = React.useState({ name: "", date: "", value: "",downloadName:"" });
  const date = new Date();
  const year = date.getFullYear(); // Get the full year (e.g., 2025)
  const month = date.getMonth() + 1; // getMonth() returns 0-11, so add 1
  const day = date.getDate(); // Get the day of the month (1-31)
  
  // Function to handle month overflow
  function getAdjustedDate(year : any, month: any, day: any) {
    year += Math.floor((month - 1) / 12); // Adjust year if month > 12
    month = ((month - 1) % 12) + 1; // Wrap month around to 1-12
    return `${year}/${month}/${day}`;
  }
    const oneMonthEnd = getAdjustedDate(year, month + 1, day); // 1 month later
  const twoMonthsEnd = getAdjustedDate(year, month + 2, day); // 2 months later
  const threeMonthsEnd = getAdjustedDate(year, month + 3, day); // 3 months later
  const sixMonthsEnd = getAdjustedDate(year, month + 6, day); // 6 months later
  const oneYearEnd = getAdjustedDate(year + 1, month, day); // 1 year later
  const handleKeyPressForNumber = (e: any) => {
    if (!/^[0-9]$/.test(e.key)) {
        e.preventDefault(); // منع الإدخال إذا لم يكن رقماً
        handleError('فقط ارقام');
    }
};  
const handleKeyPressForLetter = (e: any) => {
  if (/^[0-9]$/.test(e.key)) {
      e.preventDefault(); // منع الإدخال إذا لم يكن رقماً
      handleError('فقط احرف');
  }
};

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      id: "",
      playerName: "",
      weight: "",
      age: "",
      phoneNumber: "",
      subscriptionDuration: "1",
    },
  });

  const onSubmit = (values : any) => {
    if (!values.playerName) return handleError("اسم اللاعب مطلوب");
    if (!values.weight) return handleError("الوزن مطلوب");
    if (!values.age) return handleError("العمر مطلوب");
    if (!values.phoneNumber) return handleError("الرقم مطلوب");
    const date = new Date();
    const ID = Number(arabicToNumber(values.playerName)) + date.getTime();
    values.id=ID.toString();
    setQrData({
      downloadName:values.playerName,
      name: values.playerName,
      date: values.subscriptionDuration,
      value: ID.toString(), // This is what the QR code will contain
    });
  
    setPlayerQrcode(true);
    console.log(values);
  };
  const handleDownloadComplete = () => {
    setPlayerQrcode(false); // Hide the card
    reset(); // Reset the form
  };

  function goBack() {
    window.history.back();
  }
  const arabicToNumber = (text: any): string => {
    const arabicMap: { [key: string]: number } = {
      'ا': 1, 'ب': 2, 'ت': 3, 'ث': 4, 'ج': 5, 'ح': 6, 'خ': 7, 'د': 8, 'ذ': 9, 'ر': 10,
      'ز': 11, 'س': 12, 'ش': 13, 'ص': 14, 'ض': 15, 'ط': 16, 'ظ': 17, 'ع': 18, 'غ': 19, 'ف': 20,
      'ق': 21, 'ك': 22, 'ل': 23, 'م': 24, 'ن': 25, 'ه': 26, 'و': 27, 'ي': 28, ' ': 0
    };
  
    return [...text]
      .map(char => arabicMap[char] !== undefined ? arabicMap[char] : -1) // Convert to numbers
      .join(''); // Join without commas
  };
  return (
    <div>
      <img className={style.homeImg} src="city_Gym_Icon.png" alt="My Gym Logo" width="200" height="200" />
      <div className={style.Container}>
        <form className={style.containerForm} onSubmit={handleSubmit(onSubmit)}>
          <img src="cancel.png" alt="Back" className={style.back_button} onClick={goBack} />
          
          <label className={style.FormLabel}>اسم اللاعب</label>
          <input type="text" {...register("playerName")} placeholder="اسم اللاعب"  onKeyPress={handleKeyPressForLetter}/>

          <label className={style.FormLabel}>الوزن</label>
          <input type="text" placeholder="الوزن" onKeyPress={handleKeyPressForNumber} {...register("weight")} />

          <label className={style.FormLabel}>العمر</label>
          <input type="text" placeholder="العمر" onKeyPress={handleKeyPressForNumber} {...register("age")} />
          
          <label className={style.FormLabel} >رقم الهاتف</label>
          <input type="text" placeholder="رقم الهاتف" {...register("phoneNumber")} onKeyPress={handleKeyPressForNumber}
          />

          <label className={style.FormLabel}>مدة الاشتراك</label>
          <select className={style.selectOption} {...register("subscriptionDuration")}>
          <option value={`${year}/${month}/${day} - ${oneMonthEnd}`} >شهر</option>
          <option value={`${year}/${month}/${day} - ${twoMonthsEnd}`}>شهرين</option>
          <option value={`${year}/${month}/${day} - ${threeMonthsEnd}`}>ثلاثة أشهر</option>
          <option value={`${year}/${month}/${day} - ${sixMonthsEnd}`}>ستة أشهر</option>
          <option value={`${year}/${month}/${day} - ${oneYearEnd}`}>سنة</option>

          </select>

          <button type="submit">إنشاء رمز</button>
        </form>
        
   <div className={style.Container}> {/* Display the QR code only when playerQrcode is true */}
    {playerQrcode && (
      <PlayerQrcode 
        name={qrData.name} 
        downloadName={qrData.downloadName}
        date={qrData.date} 
        value={qrData.value}
        onDownloadComplete={handleDownloadComplete} // Pass the callback
        />
    )} 
    </div>
    </div>
      <ToastContainer />     
    </div>
  );
}


/*
<Form
  action="/api"
  method="post" // default to post
  onSubmit={() => {}} // function to be called before the request
  onSuccess={() => {}} // valid response
  onError={() => {}} // error response
  validateStatus={status => status >= 200} // validate status code
/>
*/