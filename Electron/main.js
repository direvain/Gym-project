const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const waitOn = require('wait-on');


function createMainWindow() {
  mainWindow = new BrowserWindow({
  title: 'City Gym',
    width: 1366,
    height: 768,
    icon: path.join(__dirname, 'assets', 'city_Gym_Icon.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.webContents.openDevTools();
  mainWindow.loadURL('http://localhost:3000');
}

app.whenReady().then(() => {
  console.log('Starting backend server...');
  backendProcess = spawn('npm', ['start'], {
    cwd: path.join(__dirname, './../backend'),
    shell: true,
  });

  backendProcess.stdout.on('data', (data) => console.log(`Backend: ${data}`));
  backendProcess.stderr.on('data', (data) => console.error(`Backend Error: ${data}`));

  console.log('Starting React frontend...');
  reactProcess = spawn('npm', ['start'], {
    cwd: path.join(__dirname, './../my-gym'),
    shell: true,
  });

  reactProcess.stdout.on('data', (data) => console.log(`React: ${data}`));
  reactProcess.stderr.on('data', (data) => console.error(`React Error: ${data}`));

  // Wait for servers to be ready before launching Electron window
  waitOn({ resources: ['http://localhost:3000'] })
    .then(() => {
      console.log('Servers are ready. Launching Electron app...');
      createMainWindow();
    })
    .catch((err) => console.error('Error waiting for servers:', err));
});

app.on('window-all-closed', () => {
  console.log("Cleaning up processes...");
    if (backendProcess) {
      try {
        spawn('npm', ['stop'], {
          cwd: path.join(__dirname, './backend'),
          shell: true,
        });
      } catch (e) {
        console.error("Error stopping backend:", e);
        backendProcess.kill();
      }
    }
    
    if (reactProcess) {
      try {
        spawn('npm', ['stop'], {
          cwd: path.join(__dirname, './my-gym'),
          shell: true,
        });
      } catch (e) {
        console.error("Error stopping React:", e);
        reactProcess.kill();
      }
    }
  
    if (process.platform !== 'darwin') {
      app.quit();
    }
});

app.on('will-quit', () => {
  // Make absolutely sure we kill all processes
  if (backendProcess) backendProcess.kill();
  if (reactProcess) reactProcess.kill();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});