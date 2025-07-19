// src/App.js
import React from 'react';
import MainForm from './components/mainForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Multi-Step Form with Your JSON Format
        </h1>
        <MainForm/>
      </div>
    </div>
  );
}

export default App;