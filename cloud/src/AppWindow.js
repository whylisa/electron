const { BrowserWindow } = require('electron')
class AppWindow extends BrowserWindow {
    constructor(config, urlLoaction) {
        const basicConfig = {
            width: 800,
            height: 600,
            webPreferencs: {
                nodeIntegration: true
            },
            show: false,
            backgroundColor: '#efefef'
        }
        const finalConfig = { ...basicConfig, ...config}
        super(finalConfig)
        this.loadURL(urlLoaction)
        this.once('ready-to-show' ,() => {
            this.show()
        })
    }
}