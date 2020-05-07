import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import FileSearch from './components/FileSearch'
function App() {
  return (
    <div className="App container-fluid">
       <div className="row">
         <div className="col-3 bg-light left-panel">
             <FileSearch 
               title="点击云文档"
               onFileSearch={(value) => { console.log(value)}}
             />
         </div>
         <div className="col-9 bg-primary right-panel">

         </div>

       </div>
    </div>
  );
}

export default App;
