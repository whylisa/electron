### electron概念 
   - 环境配置
     - nvm 切换node版本
     - 直接到官网clone下来就可以：git clone https://github.com/electron/electron-quick-start
   - 进程&线程
     - 进程是独立的正在运行的程序
     - 线程是操作系统能够运行调度最小单位，他被包含在进程之中，是进程中的实际运行单位
     - 区别：内存使用方面的区别、通信机制的区别、量级方面的区别
   - 主进程和渲染进程
     - main process 
       - 可以使用和系统对接的electron api 创建菜单，上传文件
       - 创建渲染进程 -renderer process
       - 全面支持node
       - 只有一个，作为整个程序的入口点
     - renderer process
       - 可以有多个，每个对应一个窗口
       - 每个都是一个单独的进程
       - 全面支持node 和dom api
       - 可以使用一部分electron提供的api
   - 创建BrowserWindow.vep
     - 负责创建窗口也就是renderer process
        ```js
        let mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: true
        }
        })
        mainWindow.loadFile('index.html')
        ```
   - 进程之间的通讯方式
     - electron 使用ipc(interprocess communication) 在进程之间进行通讯
     - 安装devtron插件：yarn add devtron -D
   - 使用IPC进行通信
     - 使用ipcRenderer 
     ```js
       const { ipcRenderer } = require('electron') 
       document.getElementById('send').addEventListener('click', () => {
        ipcRenderer.send('message', 'hi ') // 事件的名称，要发送的信息
    })
     // 监听传递过来的信息
    ipcRenderer.on('reply', (event,args) => {
        console.log(args)
        document.getElementById('message').innerHTML = args

      })
     ```
     - 然后在main.js通过ipcMain进行监听
     ```js
       ipcMain.on('message', (event,args) => {
        console.log(args)
        event.reply('reply', 'i am back')
       })
       // args是传递过来的参数，可以在输出之后可以在终端看到
       // event.reply()把我们的消息传递回去 参数和send一样，事件的名称，要发送的信息
     ```
   - 使用remote实现跨进程访问
      - 在renderer.js中,electron给我们的提供的快捷键
      ```js 
        const { BrowserWindow } = require('electron').remote
        let win = new BrowserWindow({
            height: 400,
            width: 300
        })
        win.loadURL('https://baidu.com')
      ```
### react
   - 基础略过
