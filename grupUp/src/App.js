// src/App.js
import React, { useState } from 'react';
import MainForm from './components/mainForm';
import { BgHome, startButton } from './styles/styles';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showText, setShowText] = useState(false);

  // In App.js, add this at the top of your App function:
  // console.log('🟢 App component rendered, showForm:', showForm);
  
  const handleClick = () => {
    setShowForm(true);
    setIsHovered(true)
  }
  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      {/* <BgHome> */}
      {!showForm ? (
        <div className="flex flex-col items-center pb-32">
          <span className="text-[10rem] mr-[1em]">GrupUp</span>
          <span className="inline-block mb-8 text-3xl">
            <span className={`italic text-gray-400 transition-opacity duration-500 ${showText ? 'opacity-100' : 'opacity-0'}`}>
            Find Your People </span>& Never Miss Out Again</span>
          <span className="pt-1 text-xl">Skipped that last concert because you didn't have anyone to go with?</span>
          <span className="pb-6 text-xl">Don't sit out, <span className="text-decoration: line-through">group</span> GrupUp and go out!</span>
          

           {/* 🔵 Animated Shapes */}
           {/* left person */}
          <div
            className={`absolute w-28 h-28 bg-blue-400 rounded-full transition-all duration-500 ease-out ${
              isHovered 
                ? 'transform -translate-x-1 translate-y-72 opacity-100' 
                : 'transform -translate-x-8 translate-y-36 opacity-60'
            }`}
            style={{ top: '20px', left: '10%', transformOrigin: 'center' }}
          />
          <div
            className={`absolute w-28 h-20 bg-green-300 rounded-t-full transition-all duration-500 ease-out ${
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
            className={`absolute w-28 h-20 bg-purple-400 rounded-t-full transition-all duration-500 ease-out ${
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
              }, 1000); // 3000ms = 3 seconds
            }}
            onMouseEnter={() => {setIsHovered(true); setShowText(true);}}
            onMouseLeave={() => {setIsHovered(prev => !prev);}}
            className={`${startButton} relative z-10`}
            >Get Matched!</button>
          

        </div>
      ) : ( 
            <BgHome>
            {/* <div className="bg-white rounded-xl shadow-xl p-8 max-w-5xl mx-auto w-full h-fit overflow-hidden"> */}
              <MainForm />
              {/* </div> */}
            </BgHome>
            
          
              
        )
      }
      {/* </BgHome> */}
    </div>
  );
}

export default App;