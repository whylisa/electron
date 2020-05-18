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
import fileHelper from './utils/fileHelper'
const { join, basename, extname, dirname} = window.require('path')
const { remote }  = window.require('electron')
const Store = window.require('electron-store')
const fileStore = new Store({'name': 'Files Data'})
const saveFilesToStore = (files) => {
  const filesStoreObj = objToArr(files).reduce((result, file) => {
    const { id, path, title, createdAt } =  file
    result[id] = {
      id,
      path,
      title,
      createdAt
    }
    return result
  },{})
  fileStore.set('files', filesStoreObj)
  // 新建、重命名、删除
}
function App() {
  // 文件数据
  const [files, setFiles ] = useState(fileStore.get('files')||{})
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
  const savedLocation = remote.app.getPath('documents')
  const activeFile = files[activeFileID]
  const fileClick = (fileID) => {
    // 設置當前激活的文件
    setActiveFileID(fileID)
    const currentFile = files[fileID]
    if(!currentFile) {
      fileHelper.readFile(currentFile.path).then( (value) => {
        const newFile = {...files[fileID], body: value, isLoaded: true}
        setFiles({ ...files, [fileID]: newFile})

      })
    }
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
    if(files[id].isNew) {
      const { [id]: value, ...afterDelete } = files
      setFiles(afterDelete)
    }else {
      fileHelper.deleteFile(files[id].path).then(() => {
      const { [id]: value, ...afterDelete } = files
        setFiles(afterDelete)
        saveFilesToStore(afterDelete)
        tabClose(id)
      })
    }
   
  
  }
  // 修改title
  const updateFileName = (id, title,isNew) => {
    // let newFiles = files.map((item) => {
    //   if(item.id === id) {
    //     item.title = title
    //     item.isNew = false
    //   }
    //   return item
    // })
    const newPath = isNew? join(savedLocation ,`${title}.md`)
    : join(dirname(files[id].path), `${title}.md`)
    const modifiedFile = { ...files[id],title,isNew: false, path: newPath }
    const newFiles = { ...files, [id]: modifiedFile}
    if(isNew) {
      fileHelper.writeFile(newPath,files[id].body).then(() => {
        setFiles(newFiles)
        saveFilesToStore(newFiles)
      })
    }else {
      // const oldPath = join(savedLocation, `${files[id].title}.md`)
      const oldPath = files[id].path
      fileHelper.renameFile(oldPath,newPath).then(() => {
        setFiles(newFiles)
        saveFilesToStore(newFiles)
      })
    }
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
  const importFiles = () => {
    remote.dialog.showOpenDialog({
      title: "请选择导入的Markdown文件",
      properties: ['openFile','multiSelections'],
      filters: [
        { name: "Markdown files", extensions: ['md']}
      ]

    }).then(paths => {
      // 过滤已经导入的数组
      if(Array.isArray(paths.filePaths)) {
        const filteredPaths = paths.filePaths.filter(path => {
          const alreadyAdded = Object.values(files).find(file => {
            console.log(file)
            return file === path
          })
          return !alreadyAdded
        })

        const importFilesArr = filteredPaths.map(path => {
          return {
            id: uuidv4(),
            title: basename(path, extname(path)),
            path,
          }
        })
        const newFiles = { ...files, ...flattenArr(importFilesArr)}
        console.log(newFiles)
        setFiles(newFiles)
        saveFilesToStore(newFiles)
        if(importFilesArr.length > 0){
          remote.dialog.showMessageBox({
            type: 'info',
            title: `成功`,
            message: `成功导入了${importFilesArr.length}个文件`
          })
        }
      }
    })
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
                    onBtnClick={ importFiles }
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
