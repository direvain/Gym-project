import React from 'react';
import Home from './components/Home';
import Work from './components/Work';
import {Form} from './components/Form';
import {Button} from './components/Button';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
<div
  className="App"
  style={{
    backgroundColor: '#f9a81b', // Use camelCase for CSS properties in React
    backgroundImage: 'url("https://www.transparenttextures.com/patterns/brick-wall-dark.png")', // Wrap the URL in quotes
    backgroundPosition: 'center',
    minHeight: '100vh',
    width: '100%',
  }}
>
    <img src='' alt='' />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/button" element={<Button />}/>  
      </Routes>
    </div>
  );
}

export default App;
