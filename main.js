import {app, BrowserWindow} from 'electron';
import path from 'path';
import url from 'url';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function createMainWindow() 
{
  const mainWindow = new BrowserWindow({    title:'Electron', width: 800, height: 600  });
  mainWindow.webContents.openDevTools();

  const startUrl=url.format({
    pathname: path.join(__dirname, './my-gym/src/index.tsx'),
    protocol: 'file:',
    slashes: true
  })

  mainWindow.loadURL('http://localhost:3000');

  mainWindow.on('closed', () => {
    app.quit();
  });
}

app.whenReady().then(createMainWindow);
    
