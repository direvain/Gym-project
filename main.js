import {app, BrowserWindow} from 'electron';
import path from 'path';
import url from 'url';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function createMainWindow() 
{
  const mainWindow = new BrowserWindow({    title:'Electron', width: 800, height: 600  });

  const startUrl=url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  })

  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => {
    app.quit();
  });
}

app.whenReady().then(createMainWindow);
    
