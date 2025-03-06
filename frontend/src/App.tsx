import React from 'react';
import Home from './pages/homePage/Home';
import {NewSubscription} from './pages/newSubscription/NewSubscription';
import {RenewSubscription} from './pages/renewSubscription/renewSubscription';
import { PlayerQrcodeInfo } from './pages/playerQrcode/PlayerQrcode';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
<div>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/NewSubscription" element={<NewSubscription />}/>
        <Route path="/RenewSubscription" element={<RenewSubscription />}/>
        <Route path="/PlayerQrcode" element={<PlayerQrcodeInfo value="direvain123123123123123" name="عبدالرحمن ابراهيم جمعه حبوش" date="2024/12/3 - 2025/12/3" age="20" weight="80" phoneNumber="0777211590" downloadName="`${name}`" onDownloadComplete={() => { /* Callback logic here */ }} />}/>
      </Routes>
    </div>
  );
}

export default App;
