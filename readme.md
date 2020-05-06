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
### 创建BrowserWindow.vep
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