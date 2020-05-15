const { app, shell, ipcMain } = require('electron')
const Store = require('electron-store')
const settingsStore = new Store({name: 'Settings'})

const qiniuIsConfiged = ['accessKey', 'secretKey', 'bucketName'].every(key => !!settingsStore.get(key))

let anableAutoSync = settingsStore.get('enableAutoSync')
let tempalte = [
    {
        label: '文件',
        submenu: [{
            label: '新建',
            accelerator: 'CmdOrCtrl+N',
            click: (menuItem, browserWindow, event) => {
                browserWindow.webContents.send('create-new-file')
            }
        }]

    }
]