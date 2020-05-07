import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { FontAwesomeIcon } from '@fortawesome/fontawesome-svg-core'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import './FileSearch.css'
import PropTypes from 'prop-types'

const FileSearch = ({title, onFileSearch}) => {
    const [ inputActive, setInputActive ] = useState(false)
    const [ value, setValue ] = useState('')
    const node = useRef(null)
    const closeSearch = (e) => {
        e.preventDefault()
        setInputActive(false)
        setValue('')
    }
    useEffect(() => {
        const handleInputEvent = (event) => {
            const { keyCode } = event
            if( keyCode === 13 && inputActive) {
                onFileSearch(value)
            }else if(keyCode === 27 && inputActive) {
                closeSearch(event)
            }
        }
        document.addEventListener('keyup', handleInputEvent)
        return () => {
            document.removeEventListener('keyup', handleInputEvent)
        }
    })
    useEffect(() => {
        if(inputActive) {
            node.current.focus()
        }
    },[inputActive])
    return (
        <div className="alert alert-primary">
            {
                !inputActive &&
                <div className="d-flex justify-content-between align-items-center"> 
                    <span>
                        {title}
                    </span>
                    <button onClick={()=> {setInputActive(true)}} 
                    type="button" className="icon-button">
                        <FontAwesomeIcon icon={faSearch} 
                        
                        title="搜索"/>
                    </button>
                </div>
            }
            {
                inputActive &&
                <div className="row">
                    <input  className="form-control col-8" value={value} 
                     onChange={(e) => {setValue(e.target.value)}}
                     ref={node}
                    ></input>
                    <button 
                    type="button" 
                    className="icon-button col-4"
                    onClick={ closeSearch }
                    >
                         <FontAwesomeIcon icon={faTimes} 
                        
                        title="关闭"/>
                    </button>

                </div>
            }
        </div>
    )
}
FileSearch.propTypes = {
    title: PropTypes.string,
    onFileSearch: PropTypes.func.isRequired
}
FileSearch.defaultProps = {
    title: '我的云文档'
}
export default FileSearch