import React from 'react';
import { useForm } from 'react-hook-form';
import style from './RenewSubscription.module.css';
export function RenewSubscription() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      playerName: "",
      subscriptionDuration: "1",
    },
  });
  const onSubmit = (values: any) => {
    if (!values.playerName) {
      setError("playerName", { type: "manual", message: "اسم اللاعب مطلوب" });
    }
    if (values.playerName) {
      console.log(values); // Only submit if no errors
    }
  };

  function goBack() 
  {
    window.history.back(); // Go back to the previous page
  }

  return (
    <div>    
      <div className={style.reNewContainer}>
        <form className={style.reNewForm} onSubmit={handleSubmit(onSubmit)}>
          <label className={style.reNewlabel}>اسم اللاعب</label>
          <input type='text' {...register('playerName')} placeholder='اسم اللاعب' />
          {errors.playerName?.message && (
            <div className={style.Newerror_message}>
              {errors.playerName?.message && errors.playerName.message}
            </div>
          )}

          <label className={style.reNewlabel}>مدة الاشتراك</label>
          <select required {...register("subscriptionDuration")}>
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