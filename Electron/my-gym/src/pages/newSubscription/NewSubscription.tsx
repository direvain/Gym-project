import React from "react";
import { useForm } from "react-hook-form";
import style from './NewSubscription.module.css';
import { handleError } from '../../utils/utils';
import { ToastContainer } from 'react-toastify';
import { PlayerQrcode } from "../../components/playerQrcode/PlayerQrcode";
export function NewSubscription() {

  
  const [playerQrcode, setPlayerQrcode] = React.useState(false);
  const [qrData, setQrData] = React.useState({ name: "", date: "", value: "",downloadName:"" });



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

  const onSubmit = async  (values : any) => {
    if (!values.playerName) return handleError("اسم اللاعب مطلوب");
    if (!values.weight) return handleError("الوزن مطلوب");
    if (!values.age) return handleError("العمر مطلوب");
    if (!values.phoneNumber) return handleError("الرقم مطلوب");
    try {
      const response = await fetch("http://localhost:8080/Members/addPlayer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values), // send values as JSON string
      });
      console.log(values)
      const result = await response.json();
      if (response.ok) {
        onSuccess(result);
      }
        // Check for specific error types
        if (result.error === "duplicate_phone") {
          onError("رقم الهاتف مسجل بالفعل");
        }   
      
    } catch (error) {
      onError("مشكلة بالشبكة فشل التسجيل");
    }
    
    

  
  };
  const onSuccess = (result : any ) => {
    setQrData({
      downloadName : result.name,
      name: result.name,
      date: `${result.subscriptionDurationStart} - ${result.subscriptionDurationEnd}`,
      value: result.qrCodeValue 
    });
  
    setPlayerQrcode(true);
  };
  
  const onError = (message: string) => {
    alert(message);
  };
  const handleDownloadComplete = () => {
    setPlayerQrcode(false); // Hide the card
    reset(); // Reset the form
  };
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
  function goBack() {
    window.history.back();
  }

  return (
    <div>
      <img className={style.homeImg} src="./images/city_Gym_Icon.png" alt="My Gym Logo" width="200" height="200" />
      <div className={style.Container}>
        <form className={style.containerForm} onSubmit={handleSubmit(onSubmit)}>
          <img src="./images/cancel.png" alt="Back" className={style.back_button} onClick={goBack} />
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
          <option value='1' >شهر</option>
          <option value='2'>شهرين</option>
          <option value='3'>ثلاثة أشهر</option>
          <option value='6'>ستة أشهر</option>
          <option value='12'>سنة</option>

          </select>

          <button type="submit">إنشاء رمز</button>
        </form>
        
   <div className={style.QRcodeContainer}> {/* Display the QR code only when playerQrcode is true */}
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

