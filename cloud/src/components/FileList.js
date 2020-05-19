import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash ,faTimes} from '@fortawesome/free-solid-svg-icons'
import useKeyPress from '../hooks/useKeyPress'
import useContextMenu from '../hooks/useContextMenu'
import PropTypes from 'prop-types'
import { getParentNode } from '../utils/helper'
const FileList = ({ files, onFileClick, onSaveEdit, onFileDelete}) => {
    const [editStatus, setEditStatus] = useState(false)
    const [ value ,setValue] = useState('')
    const enterPressed = useKeyPress(13)
    const escPressed = useKeyPress(27)
    const closeSearch = (editItem) => {
        setEditStatus(false)
        setValue('')
        if (editItem.isNew) {
            onFileDelete(editItem.id)
        }
    }
    const clickedItem = useContextMenu([
        {
            label: '打开',
            click: () => {
                const parentElement = getParentNode(clickedItem.current, 'file-item')
                console.log(parentElement.dataset.id)
                if(parentElement) {
                    onFileClick(parentElement.dataset.id)
                }

            }
        },
        {
            label: '重命名',
            click: () => {
                console.log('cli')
            }
        },
        {
            label: '删除',
            click: () => {
                console.log('cli')
            }
        }
    ],".file-list",[files])
    useEffect(() => {
        const editItem = files.find(file => file.id === editStatus)

        if( enterPressed && editStatus) {
            console.log(editItem.id)
            onSaveEdit(editItem.id, value,editItem.isNew)
            setValue('')
            setEditStatus(false)
        }
        if( escPressed && editStatus) {
            closeSearch(editItem)
        }
    })
    useEffect(() => {
        const newFile = files.find(file => file.isNew)
        if (newFile) {
          setEditStatus(newFile.id)
          setValue(newFile.title)
        }
      }, [files])
    return (
        <ul className="list-group list-group-flush file-list">
            {
                files.map(file => (
                    <li 
                    className="row list-group-item bg-light d-flex align-items-center file-item"
                    key={file.id}  
                    data-id={file.id}
                    data-title={file.title}
                    >
                        { (file.id !== editStatus && !file.isNew) &&
                        <>
                        <span onClick={() => onFileClick(file.id)} className="col-8">{file.title}</span>
                        <button 
                         type="button"
                         className="icon-button col-2"
                         onClick={() => { setEditStatus(file.id);setValue(file.title)}}
                        >
                            <FontAwesomeIcon title="编辑" size="lg" icon={faEdit}></FontAwesomeIcon>
                        </button>
                        <button 
                          type="button"
                          className="icon-button col-2"
                          onClick={ () => onFileDelete(file.id) }
                        >            
                            <FontAwesomeIcon title="修改" size="lg" icon={faTrash}></FontAwesomeIcon>
                        </button>
                        </>
                        }
                        {
                         ( file.id === editStatus || file.isNew) &&
                         <div className="row">
                         <input  className="form-control col-8" value={value} 
                          onChange={(e) => {setValue(e.target.value)}}
                         ></input>
                         <button 
                         type="button" 
                         className="icon-button col-4"
                         onClick={ () => {closeSearch(file)} }
                         >
                              <FontAwesomeIcon icon={faTimes} 
                             
                             title="关闭"/>
                         </button>
     
                     </div>
                        }
                    </li>
               ))
            }

        </ul>
    )
}
FileList.propTypes = {
    files: PropTypes.array,
    onFileClick: PropTypes.func,
    onFileDelete: PropTypes.func,
    onSaveEdit: PropTypes.func
}
export default FileList