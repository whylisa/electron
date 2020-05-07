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
   - npx：避免安装全局模块、调用项目内部安装的模块
   - effect hook 
     - 无需清除的Effect(副作用)
     - 需要清除的Effect:防止内存泄漏
     - 清除要在useEffect中执行，一般是return一个函数
     - 控制useEffect的执行：第二个参数设置成false
     - 自定义hook：将组建逻辑提取到可重用的函数中
     - 高阶组件就是一个函数，接受一个组件作为参数，放回一个组件
     - 只在最顶层使用hook,只在react函数中使用hook
### 项目
#### 全局需求
   - 原生菜单，通过菜单和快捷键可以新建保存，搜索文件
   - 持久化数据，保存文件在本地文件系统
   - 需求分类
     - react: 搜索框，文件列表，新建文件，文件tabs,编辑器
     - electron: 文件列表右键子菜单，文件导入，应用菜单，全局快捷键，文件数据持久化保存
#### react哲学
   - 将设计好的UI划分为组件层级
   - 创建应用的静态版本
#### 配置开发环境
   - npx create-react-app cloud
   - yarn add electron -D
   - yarn add electron-is-dev -D
   - 先启动react，再启动electron
   - 合并命令 使用 yarn add concurrently -D
   - 等待资源成功之后，再运行其他命令 yarn add wait-on -D
   - 使用cross-env 来跨平台关闭默认打开浏览器
#### 文件结构和代码规范
   - 简洁，易于复用，不要嵌套过深
   - 
#### 功能開發
   - 安装组件库：yarn add bootstrap 
   - fileSearch组件
     - 使用bootstrap 进行栅格布局，同时使用flex
     - 添加键盘相应事件（enter,esc）
     - 使用useRef完成input框事件操作,记住dom节点
   - 为项目选择图标库
     - 使用fontawesome-react
       ```js
        yarn add @fortawesome/fontawesome-svg-core
        yarn add @fortawesome/free-solid-svg-icons
        yarn add @fortawesome/react-fontawesome

       ```
   - 使用PropTypes 进行类型检查
     ```js
       FileSearch.propTypes = {
           title: PropTypes.string,
           onFileSearch: PropTypes.func.isRequired
       }
       // 默认值
       FileSearch.defaultProps = {
           title: '我的云文档'
       }
     ```

