const { app,Menu, ipcMain} = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')
const menuTemplate = require('./src/menuTemplate')
const AppWindow = require('./src/AppWindow')
let mainWindow,settingsWindow;

app.on('ready', () => {
    const mainWindowConfig = {
                height: 680,
                width: 1024,
            }
    const urlLocation = isDev? 'http://localhost:3000': 'dumm'
    mainWindow = new AppWindow(mainWindowConfig, urlLocation)
    mainWindow.on('closed',() => {
        mainWindow = null
    })
    ipcMain.on('open-settings-window', () => {
        console.log(1)
        const settingsWindowConfig = {
            width: 500,
            height: 400,
            parent: mainWindow
        }
        const settingsFileLocation = `file://${path.join(__dirname, './settings/settings.html')}`
        settingsWindow = new AppWindow(settingsWindowConfig,settingsFileLocation)
        settingsWindow.on('closed',() => {
            mainWindow = null
        })
    })
    // 设置menu
    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)
})
