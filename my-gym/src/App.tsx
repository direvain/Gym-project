import React from 'react';
import Home from './pages/homePage/Home';
import {NewSubscription} from './pages/newSubscription/NewSubscription';
import {RenewSubscription} from './pages/renewSubscription/RenewSubscription';
import { PlayerQrcode } from './pages/playerQrcode/PlayerQrcode';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
<div>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/NewSubscription" element={<NewSubscription />}/>
        <Route path="/RenewSubscription" element={<RenewSubscription />}/>
        <Route path="/PlayerQrcode" element={<PlayerQrcode />}/>
      </Routes>
    </div>
  );
}

export default App;
