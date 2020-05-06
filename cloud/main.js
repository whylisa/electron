const { app, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev')

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        height: 680,
        width: 1024,
        webPreferences: {
            nodeIntegration: true
        }
    })
    const urlLocation = isDev? 'http://localhost:3000': 'dumm'
    mainWindow.loadURL(urlLocation)
})