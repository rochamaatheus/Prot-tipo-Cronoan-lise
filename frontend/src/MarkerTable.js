// frontend/src/MarkerTable.js

import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function MarkerTable({ markers }) {
  const formatTime = (timeMs) => {
    if (timeMs === null) return 'Em progresso';
    const totalSeconds = Math.floor(timeMs / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    const milliseconds = String(Math.floor(timeMs % 1000)).padStart(3, '0');
    return `${minutes}:${seconds}:${milliseconds}`;
  };

  const exportToExcel = () => {
    // Preparar os dados
    const data = markers.map((marker) => ({
      Evento: marker.name,
      'Tempo Inicial': formatTime(marker.startTime),
      'Tempo Final': marker.endTime
        ? formatTime(marker.endTime)
        : 'Em progresso',
    }));

    // Criar a planilha
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Marcadores');

    // Gerar o buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Salvar o arquivo
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'marcadores.xlsx');
  };

  return (
    <div className="marker-table">
      <h3>Marcadores</h3>
      <button onClick={exportToExcel}>Exportar para Excel</button>
      <table>
        <thead>
          <tr>
            <th>Evento</th>
            <th>Início</th>
            <th>Fim</th>
          </tr>
        </thead>
        <tbody>
          {markers.map((marker, i) => (
            <tr key={i} style={{ backgroundColor: marker.color }}>
              <td>{marker.name}</td>
              <td>{formatTime(marker.startTime)}</td>
              <td>
                {marker.endTime ? formatTime(marker.endTime) : 'Em progresso'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MarkerTable;
