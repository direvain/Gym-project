import React from "react";
import {useForm} from "react-hook-form";
import style from './NewSubscription.module.css';
import QRcode from 'qrcode';
import { QRCode } from 'react-qrcode-logo';
import { handleError, handleSuccess } from '../../utils/utils'
import { toast, ToastContainer, Zoom } from 'react-toastify';


import { PlayerQrcode } from "../../components/playerQrcode/PlayerQrcode";
export function NewSubscription() {
  const arabicMap: { [key: string]: number }  = {
    'ا': 1, 'ب': 2, 'ت': 3, 'ث': 4, 'ج': 5, 'ح': 6, 'خ': 7, 'د': 8, 'ذ': 9, 'ر': 10,
    'ز': 11, 'س': 12, 'ش': 13, 'ص': 14, 'ض': 15, 'ط': 16, 'ظ': 17, 'ع': 18, 'غ': 19, 'ف': 20,
    'ق': 21, 'ك': 22, 'ل': 23, 'م': 24, 'ن': 25, 'ه': 26, 'و': 27, 'ي': 28, ' ': 0
};
const [playerQrcode, setPlayerQrcode] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      id: "",
      playerName: "",
      weight: "",
      age: "",
      phoneNumber: "",
      subscriptionDuration: "1",
    },
  });

  const onSubmit = (values: any) => {
    if (!values.playerName) {
      handleError("اسم اللاعب مطلوب" );

    }
    if (!values.weight) {
      handleError("الوزن مطلوب" );

    }
    if (!values.age) {
      handleError("العمر مطلوب" );
    }
    if (!values.phoneNumber) {
      handleError("الرقم مطلوب" );

    }

    if (values.playerName && values.weight && values.age && values.phoneNumber) {
      const initials = values.playerName.split(' ').map((word: string) => word.trim()).filter((word: string) => word.length > 0)
      .map((word: string) => word[0]).join('');
    
    const encryptedText = [...initials]
      .map((char: string) => arabicMap[char]).join('');
    
            values.id=encryptedText+ new Date().getTime();
            console.log(values.id);
            const qrCodeElement = (
              <QRCode 
                value={'123' + values.id} 
                ecLevel='H'
                size={100}
                fgColor='#000'
                bgColor='#ffb01d'
                qrStyle='dots'
                quietZone={10}
                removeQrCodeBehindLogo={true}
              />
            );

      QRcode.toDataURL(123+values.id, { errorCorrectionLevel: 'H' }).then((url) => {
          console.log(url);
        }).catch((err) => {
          console.error("Error generating QR code:", err);
        });
        console.log(values); // Only submit if no errors 



        

        reset();

      }


  };
  function goBack() 
  {
    window.history.back(); // Go back to the previous page
  } 
  return (
  <div>
    <img className={style.homeImg} src="city_Gym_Icon.png" alt="My Gym Logo" width="200" height="200"/>
    <div className={style.Container}>
      <form className={style.containerForm} onSubmit={handleSubmit(onSubmit)}>
        
        <img src="cancel.png" alt="My Gym Logo" className={style.back_button} onClick={goBack}/>

        <label className={style.FormLabel}>اسم اللاعب</label>
        <input type="text" {...register("playerName")} placeholder="اسم اللاعب" />

        <label className={style.FormLabel}>الوزن</label>
        <input
          type="number" 
          placeholder="الوزن"
          min='1'
          max='200'
          step='0.01'
          {...register("weight")}
          />

        <label className={style.FormLabel}>العمر</label>
        <input
          type="number" 
          placeholder="العمر"
          min='1'
          max='100'
          step='1'
          {...register("age")}
          />

        
        <label className={style.FormLabel}>رقم الهاتف</label>
        <input
          type="text" 
          placeholder="رقم الهاتف"
          {...register("phoneNumber")}
          />


        <label className={style.FormLabel}>مدة الاشتراك</label>
        <select  className={style.selectOption}  {...register("subscriptionDuration")}>
          <option value="1">شهر</option>
          <option value="2">شهرين </option>
          <option value="3">ثلاثة أشهر</option>
          <option value="6">ستة أشهر</option>
          <option value="12">سنة</option>
        </select>

        <button type="submit">إنشاء رمز</button>
      </form>
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