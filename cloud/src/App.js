import React, {useState}from 'react'
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import FileSearch from './components/FileSearch'
import FileList from './components/FileList'
import defaultFiles from './utils/defaultFiles'
import { flattenArr, objToArr} from './utils/helper'
import BottomBtn from "./components/BottomBtn";
import TabList from './components/TabList'
import SimpleMDE from "react-simplemde-editor"
import uuidv4 from 'uuid/dist/v4'
const fs = window.require('fs')

const Store = window.require('electron-store')
const store = new Store()
store.set('name', 'nameVlaue')
console.log('electron', store.get('name'))
function App() {
  // 文件数据
  const [files, setFiles ] = useState(flattenArr(defaultFiles))
  // 激活的那一条数据
  const [ activeFileID, setActiveFileID ] =useState('')
  // 打开文件的集合
  const [ openedFileIDs, setOpenedFileIDs ] = useState([])
  // 未保存的文件
  const [ unsavedFileIDs, setUnsavedFileIDs ] = useState([])
  // 保存search时的状态集合
  const [ searchedFiles, setSearchFiles ] = useState([])
  // 打开的文件
  const filesArr = objToArr(files)
  const activeFile = files[activeFileID]
  const fileClick = (fileID) => {
    // 設置當前激活的文件
      setActiveFileID(fileID)
      // 把fileID添加到openedFileIDs中
    if(!openedFileIDs.includes(fileID)) {
      setOpenedFileIDs([...openedFileIDs, fileID])
    }
    
  }
  const tabClick = (fileID) => {
    // tab切换
    setActiveFileID(fileID)
  }

  const tabClose = (id) => {
    //过滤出其他未删除tab
    const tabsWithout = openedFileIDs.filter(fileID => fileID !== id)
    // 直接修改state
    setOpenedFileIDs(tabsWithout)
    // 判断条件如果tab的length>0 让第一个高亮，或清空
    if (tabsWithout.length > 0) {
      setActiveFileID(tabsWithout[0])
    } else {
      setActiveFileID('')
    }
  }
  // 文件变化
  const fileChange = (id,value) => {
    // 循环更新新的value
    //  const newFiles = files.map(file => {
    //    if( file.id === id) {
    //      file.body = value
    //    }
    //    return file
    //  })
    const newFile = { ...files[id], body: value}
     setFiles({ ...files,[id]: newFile})
     // 更新 unsavedIDs
     if( !unsavedFileIDs.includes(id)) {
       setUnsavedFileIDs([...unsavedFileIDs, id])
     }
  } 
  // 文件删除
  const fileDelete = (id) => {
    // 过滤出不等于当前点击的项，然后更新files
    // const newFileList = files.filter(file => file.id !== id)
    delete files[id]
    setFiles(files)
    tabClose(id)
  }
  // 修改title
  const updateFileName = (id, title) => {
    // let newFiles = files.map((item) => {
    //   if(item.id === id) {
    //     item.title = title
    //     item.isNew = false
    //   }
    //   return item
    // })
    const modifiedFile = { ...files[id], title: title,isNew: false}

    setFiles({...files, [id]: modifiedFile})
  }
  // 查询文件
  const fileSearch = (value) => {
    console.log(searchedFiles)
    const newFiles = filesArr.filter(item => item.title.includes(value))
    if(newFiles) {
      setSearchFiles(newFiles)
    }else {
      searchedFiles([])
    }
  }
  // 新建文件
  const createNewFile = () => {
    const newID = uuidv4()
    // const newFile = [
    //   ...files,
    //   {
    //     id: newID,
    //     title: '',
    //     body: '## 请输入Mak',
    //     createdAt:new Date().getTime(),
    //     isNew: true
    //   }
    // ]
    const newFile = {
        id: newID,
        title: '',
        body: '## 请输入Mak',
        createdAt:new Date().getTime(),
        isNew: true
      }
    setFiles({ ...files, [newID]: newFile })
  }
  const openedFiles = openedFileIDs.map(openID => {
    return files[openID]
  })
  const fileListArray = (searchedFiles.length > 0) ? searchedFiles: filesArr
  return (
    <div className="App container-fluid">
       <div className="row">
         <div className="col-3 bg-light left-panel">
             <FileSearch 
               title="点击云文档"
               onFileSearch={ fileSearch }
             />
             <FileList 
               files={ fileListArray }
               onFileClick={ fileClick }
               onFileDelete={ fileDelete }
               onSaveEdit={ updateFileName }
             />
             <div className="row button-group">
               <div className="col-6">
                  <BottomBtn 
                    text="新建"
                    colorClass="btn-primary"
                    icon={faPlus}
                    onBtnClick={ createNewFile }
                  />
               </div>
               <div className="col-6">
                   <BottomBtn 
                    text="导入"
                    colorClass="btn-success"
                    icon={faFileImport}
                  />
               </div>
             </div>
         </div>
         <div className="col-9  right-panel">
           {
             !activeFile && 
             <div className="start-page">
               选择或者创建markDown文件
             </div>
           }
           { 
             activeFile &&
           <>
            <TabList 
              files={openedFiles}
              activeId={activeFileID}
              unsaveIds={unsavedFileIDs}
              onTabClick={tabClick}
              onCloseTab={tabClose}
            />
            <SimpleMDE 
               key={activeFile && activeFile.id} //切换要加key id标识出当前的mk
               value={activeFile && activeFile.body}
               onChange={(value) => {fileChange(activeFile.id, value)}}
               options={{
                minHeight: '500px',
              }}
            />
            </>
            }
         </div>

       </div>
    </div>
  );
}

export default App;
