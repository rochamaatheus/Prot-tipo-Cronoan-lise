// main.js

const { app, BrowserWindow, ipcMain, dialog, protocol } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
  });

  // Carrega o front-end React
  const startUrl =
    process.env.ELECTRON_START_URL ||
    `file://${path.join(__dirname, 'frontend', 'build', 'index.html')}`;
  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Handler para abrir o diálogo de seleção de arquivo
ipcMain.handle('dialog:openFile', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'Vídeos', extensions: ['mp4', 'avi', 'mov', 'mkv'] }],
  });
  if (canceled) {
    return null;
  } else {
    return filePaths[0];
  }
});

app.whenReady().then(() => {
  protocol.registerFileProtocol('safe-file', (request, callback) => {
    const url = request.url.substr('safe-file://'.length);
    try {
      callback({ path: decodeURIComponent(url) });
    } catch (err) {
      console.error('Erro ao registrar o protocolo:', err);
    }
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  // No macOS é comum que as aplicações continuem ativas até que o usuário saia explicitamente
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
