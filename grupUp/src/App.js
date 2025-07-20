// src/App.js
import React, { useState } from 'react';
import MainForm from './components/mainForm';
import { startButton } from './styles/styles';

function App() {
  const [showForm, setShowForm] = useState(false);
  const handleClick = () => {
    setShowForm(true);
  }
  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      {!showForm ? (
        <div className="flex flex-col items-center space-y-6 pb-32">
          <h1 className="text-4xl">User Matching Algorithm &#x2740;</h1>
          <button onClick={handleClick} className={startButton}>Start</button>
        </div>
      ) : ( <MainForm />)}
    </div>
  );
}

export default App;