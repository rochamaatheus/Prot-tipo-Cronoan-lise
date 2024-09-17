// frontend/src/VideoPlayer.js

import React, { useRef, useState, useEffect } from 'react';
import MarkerControls from './MarkerControls';
import MarkerTable from './MarkerTable';

function VideoPlayer() {
  // Referência ao elemento de vídeo
  const videoRef = useRef(null);

  // Estados
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [markers, setMarkers] = useState([]);
  const [markerName, setMarkerName] = useState('');
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [videoPath, setVideoPath] = useState(null);

  // Atualização do tempo atual em milissegundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current) {
        setCurrentTimeMs(videoRef.current.currentTime * 1000);
      }
    }, 1); // Atualiza a cada 1 milissegundo

    return () => clearInterval(interval);
  }, []);

  // Formatar o tempo em mm:ss:ms
  const formatTime = (timeMs) => {
    const totalSeconds = Math.floor(timeMs / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    const milliseconds = String(Math.floor(timeMs % 1000)).padStart(3, '0');
    return `${minutes}:${seconds}:${milliseconds}`;
  };

  const handleOpenFile = async () => {
    const filePath = await window.electronAPI.openFile();
    if (filePath) {
      setVideoPath(filePath);
      console.log('Video path:', filePath);
      // Reiniciar os marcadores e o tempo
      setMarkers([]);
      setCurrentTimeMs(0);
    }
  };

  const handleAddMarker = () => {
    setIsAddingMarker(true);
    setMarkers([
      ...markers,
      {
        name: markerName || `Evento ${markers.length + 1}`,
        startTime: currentTimeMs,
        endTime: null,
        color: getRandomColor(),
      },
    ]);
    setMarkerName('');
  };

  const handlePauseMarker = () => {
    setIsAddingMarker(false);
    setMarkers(
      markers.map((marker, i) => {
        if (i === markers.length - 1 && marker.endTime === null) {
          return { ...marker, endTime: currentTimeMs };
        }
        return marker;
      }),
    );
  };

  const handleRemoveMarker = () => {
    setMarkers(markers.slice(0, -1));
    setIsAddingMarker(false);
  };

  const getRandomColor = () => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="video-player-container">
      <div className="timer">Tempo Decorrido: {formatTime(currentTimeMs)}</div>
      <button onClick={handleOpenFile}>Selecionar Vídeo</button>
      {videoPath ? (
        <div className="video-and-controls">
          <video
            ref={videoRef}
            controls
            width="640"
            height="360"
            preload="auto"
          >
            <source src={`safe-file://${videoPath}`} />
            Seu navegador não suporta a reprodução de vídeo.
          </video>
          <MarkerControls
            markerName={markerName}
            setMarkerName={setMarkerName}
            handleAddMarker={handleAddMarker}
            handlePauseMarker={handlePauseMarker}
            handleRemoveMarker={handleRemoveMarker}
            isAddingMarker={isAddingMarker}
            isVideoLoaded={!!videoPath} // Passa true se o vídeo estiver carregado
          />
        </div>
      ) : (
        <p>Por favor, selecione um vídeo para começar.</p>
      )}
      <MarkerTable markers={markers} />
    </div>
  );
}

export default VideoPlayer;
