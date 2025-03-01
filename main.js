const { app, BrowserWindow, ipcRenderer } = require('electron');
const url = require('url');
const path = require('path');
const { ipcMain } = require('electron');

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: 'My buddy app',
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.webContents.openDevTools();
  mainWindow.loadURL('http://localhost:3000');
}

app.whenReady().then(createMainWindow);
ipcMain.on('name', (event, arg) => {
  console.log(arg);
});