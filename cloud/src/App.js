import React from 'react'
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons'

import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import FileSearch from './components/FileSearch'
import FileList from './components/FileList'
import defaultFiles from './utils/defaultFiles'
import BottomBtn from "./components/BottomBtn";
function App() {
  return (
    <div className="App container-fluid">
       <div className="row">
         <div className="col-3 bg-light left-panel">
             <FileSearch 
               title="点击云文档"
               onFileSearch={(value) => { console.log(value)}}
             />
             <FileList 
               files={defaultFiles}
               onFileClick={(id) => { console.log(id)}}
               onFileDelete={(id) => { console.log('del',id)}}
               onSaveEdit={(id, newValue) => {console.log(id, newValue)}}
             />
             <div className="row">
               <div className="col-6">
                  <BottomBtn 
                    text="新建"
                    colorClass="btn-primary"
                    icon={faPlus}
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
         <div className="col-9 bg-primary right-panel">

         </div>

       </div>
    </div>
  );
}

export default App;
