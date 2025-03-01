import React, { useEffect } from "react";
import style from './playerQrcode.module.css'
import { QRCode } from 'react-qrcode-logo';

export function PlayerQrcode(props : any) {
    return (
        <div>
            <img className={style.homeImg} src="city_Gym_Icon.png" alt="My Gym Logo" width="200" height="200"/>

            <div className={style.PlayerViewContainer}>
                    
                    <img src="city_Gym_Icon.png" alt="My Gym Logo" className={style.PlayerViewLogo} width={150}/>
                <QRCode 
                    value="13qqweqweqasdwasd" 
                    ecLevel='L'
                    size={100}
                    fgColor='#000'
                    bgColor='#ffb01d'
                    quietZone={10}
                    removeQrCodeBehindLogo={true}
                />
                    <br/> 



                <label className={style.playerName}>{props.name}عبدالرحمن ابراهيم حبوش</label>
                
                <label>{props.age} 21</label>

                <label>{props.weight}100</label>
                 
                  
                   
                    
                     
                      
                       
                       
                <br/>
                <label>{props.subscriptionDuration}2025-12-1 / 2026-3-1 remove</label>
            </div>
        </div>
    )
}