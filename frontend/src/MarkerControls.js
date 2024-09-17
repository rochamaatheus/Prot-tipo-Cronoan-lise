// frontend/src/MarkerControls.js

function MarkerControls({
  markerName,
  setMarkerName,
  handleAddMarker,
  handlePauseMarker,
  handleRemoveMarker,
  isAddingMarker,
  isVideoLoaded,
}) {
  return (
    <div className="marker-controls">
      <input
        type="text"
        placeholder="Nome do marcador"
        value={markerName}
        onChange={(e) => setMarkerName(e.target.value)}
        disabled={!isVideoLoaded}
      />
      <button
        onClick={handleAddMarker}
        disabled={!isVideoLoaded || isAddingMarker}
      >
        Adicionar Marcador
      </button>
      <button onClick={handlePauseMarker} disabled={!isAddingMarker}>
        Pausar Marcador
      </button>
      <button onClick={handleRemoveMarker} disabled={!isVideoLoaded}>
        Remover Último Marcador
      </button>
    </div>
  );
}

export default MarkerControls;
