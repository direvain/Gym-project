const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Global references


// Check if we're in development or production
const isDev = !app.isPackaged;

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

  // Load the appropriate source

    mainWindow.loadURL('http://localhost:3000');
    // Uncomment to open DevTools in development
    // mainWindow.webContents.openDevTools();


  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
    // Development mode - only try to use wait-on in development
    console.log('Starting backend server in development mode...');
    let backendProcess = spawn('npm', ['start'], {
      cwd: path.join(__dirname, './backend'),
      shell: true,
    });

    backendProcess.stdout.on('data', (data) => console.log(`Backend: ${data}`));
    backendProcess.stderr.on('data', (data) => console.error(`Backend Error: ${data}`));

    console.log('Starting React frontend in development mode...');
    let reactProcess = spawn('npm', ['start'], {
      cwd: path.join(__dirname, './my-gym'),
      shell: true,
    });

    reactProcess.stdout.on('data', (data) => console.log(`React: ${data}`));
    reactProcess.stderr.on('data', (data) => console.error(`React Error: ${data}`));

    // Try to import wait-on dynamically
    try {
      const waitOn = require('wait-on');
      // Wait for React server to be ready
      waitOn({ resources: ['http://localhost:3000'] })
        .then(() => {
          console.log('Servers are ready. Launching Electron app...');
          createMainWindow();
        })
        .catch((err) => console.error('Error waiting for servers:', err));
    } catch (err) {
      console.log('wait-on module not available, waiting 5 seconds before launching app...');
      // Fallback: just wait a few seconds
      setTimeout(() => {
        createMainWindow();
      }, 5000);
    }
  
  
});

app.on('window-all-closed', () => {
  console.log("Cleaning up processes...");
   
    // In development, attempt to run stop commands
    let backendProcessStop = spawn('npm', ['stop'], {
      cwd: path.join(__dirname, './backend'),
      shell: true,
    });
    
    let reactProcessStop = spawn('npm', ['stop'], {
      cwd: path.join(__dirname, './my-gym'),
      shell: true,
    });
   console.log("done")
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});



app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});