// frontend/src/App.js
import React from 'react';
import VideoPlayer from './VideoPlayer';
import './App.css';

function App() {
  return (
    <div className="app">
      <h1>Cronoanálise de Vídeos</h1>
      <VideoPlayer />
    </div>
  );
}

export default App;
