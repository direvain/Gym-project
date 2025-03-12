import React from 'react';
import Home from './pages/homePage/Home';
import {NewSubscription} from './pages/newSubscription/NewSubscription';
import { Routes, Route } from 'react-router-dom';


function App() {
  return (
<div>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/NewSubscription" element={<NewSubscription />}/>
      </Routes>
    </div>
  );
}

export default App;
