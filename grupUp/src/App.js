// src/App.js
import React, { useState } from 'react';
import MainForm from './components/mainForm';
import { startButton } from './styles/styles';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showText, setShowText] = useState(false);
  const [countdown, setCountdown] = useState(null);
  
  const handleClick = () => {
    setShowForm(true);
  }
  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      {!showForm ? (
        <div className="flex flex-col items-center pb-32">
          <span className="text-[10rem] mr-[1em]">GrupUp</span>
          <span className="inline-block text-base mb-8 text-3xl">
            <span className={`italic text-gray-400 transition-opacity duration-500 ${showText ? 'opacity-100' : 'opacity-0'}`}>
            Find Your People </span>& Never Miss Out Again</span>
          <span className="pt-1 text-xl">Missed out on that last concert because you didn't have anyone to go with?</span>
          <span className="pb-6 text-xl">Don't sit out, <span className="text-decoration: line-through">group</span> GrupUp and go out!</span>
          

           {/* 🔵 Animated Shapes */}
           {/* left person */}
          <div
            className={`absolute w-28 h-28 bg-orange-400 rounded-full transition-all duration-500 ease-out ${
              isHovered 
                ? 'transform -translate-x-1 translate-y-72 opacity-100' 
                : 'transform -translate-x-8 translate-y-36 opacity-60'
            }`}
            style={{ top: '20px', left: '10%', transformOrigin: 'center' }}
          />
          <div
            className={`absolute w-28 h-20 bg-pink-300 rounded-t-full transition-all duration-500 ease-out ${
              isHovered 
                ? 'transform translate-x-32 -translate-y-64 rotate-0 opacity-100' 
                : 'transform -translate-x-4 -translate-y-4 rotate-90 opacity-60'
            }`}
            style={{ bottom: '20px', left: '20px' }}
          />

          {/* right person */}

          <div
            className={`absolute w-28 h-28 bg-pink-300 rounded-full transition-all duration-500 ease-out ${
              isHovered 
                ? 'transform -translate-x-1 translate-y-72 rotate-0 opacity-100' 
                : 'transform translate-x-16 translate-y-10 rotate-45 opacity-60'
            }`}
            style={{ top: '20px', right: '10%' }}
          />

          <div
            className={`absolute w-28 h-20 bg-orange-400 rounded-t-full transition-all duration-500 ease-out ${
              isHovered 
                ? 'transform -translate-x-32 -translate-y-64 rotate-0 opacity-100' 
                : 'transform translate-x-0 translate-y-0 rotate-0 opacity-60'
            }`}
            style={{ bottom: '20px', right: '20px' }}
          />
          {/* <button onClick={handleClick} className={startButton}>Get Matched</button> */}

          <button
            onClick={() => {
              setTimeout(() => {
                handleClick();
              }, 2000); // 3000ms = 3 seconds
            }}
            onMouseEnter={() => {setIsHovered(true); setShowText(true);}}
            onMouseLeave={() => {setIsHovered(false); setShowText(false);}}
            className={`${startButton} relative z-10`}
            >Get Matched!</button>
          

        </div>
      ) : ( <MainForm />)}
    </div>
  );
}

export default App;