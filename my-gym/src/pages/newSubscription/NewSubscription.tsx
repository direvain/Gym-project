import React from "react";
import { useForm } from "react-hook-form";
import style from './NewSubscription.module.css';
export function NewSubscription() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      playerName: "",
      weight: "",
      subscriptionDuration: "1",
    },
  });

  const onSubmit = (values: any) => {
    if (!values.playerName) {
      setError("playerName", { type: "manual", message: "اسم اللاعب مطلوب" });
    }
    if (!values.weight) {
      setError("weight", { type: "manual", message: "الوزن مطلوب" });
    }

    if (values.playerName && values.weight) {
      console.log(values); // Only submit if no errors
    }
  };
  function goBack() 
  {
    window.history.back(); // Go back to the previous page
  } 
  return (
  <div>
    <div className={style.Container}>
      <form className={style.containerForm} onSubmit={handleSubmit(onSubmit)}>

        <label className={style.FormLabel}>اسم اللاعب</label>
        <input type="text" {...register("playerName")} placeholder="اسم اللاعب" />
        {errors.playerName?.message &&
        (<div className={style.error_message}>
          {errors.playerName?.message && errors.playerName.message}
        </div>)} 

        <label className={style.FormLabel}>الوزن</label>
        <input type="number" placeholder="الوزن" {...register("weight")} />
        {errors.weight?.message && 
        (<div className={style.error_message}>
          {errors.weight?.message && errors.weight.message}
        </div>)}

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
    <img src="icon-back.png" alt="My Gym Logo" className={style.back_button} onClick={goBack}/>    
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