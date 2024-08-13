import React, { useState } from 'react';
import './Modal.css';
import { useDropzone } from 'react-dropzone';
import Modal1 from './Modal1';
import axios from 'axios';

const Modal = ({ close, addTag }) => {
  const [tag, setTag] = useState("");
  const [count, setCount] = useState("");
  const [objective, setobjective] = useState("");
  const [file, setFile] = useState(null);
  const [uploadedFilePath, setUploadedFilePath] = useState(null);
  const [isModal1Open, setIsModal1Open] = useState(false);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleAddButtonClick = async () => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('tag', tag);
    formData.append('objective', objective);
    formData.append('count', count);

    try {
      const res = await axios.post('http://localhost:5000/addtag', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(res.data);
      const newTag = { name: tag, count, file: res.data.filePath };
      addTag(newTag);
      setUploadedFilePath(res.data.filePath); 
      close(); 
    } catch (err) {
      console.error('Error while adding tag:', err.response ? err.response.data : err.message);
    }
  };

  const handleOpenModal1 = () => {
    setIsModal1Open(true);
  };

  const handleCloseModal1 = () => {
    setIsModal1Open(false);
  };

  return (
    <>
      {!isModal1Open && (
        <div className='modal'>
          <div className='modal-container'>
            <div className='header1' style={{marginBottom:'0'}}>
              <h2 >ADD TAGS</h2>
            </div>
            <div>
              <table>
                <tbody>
                  <tr>
                    <td className='Tag'><label htmlFor="tagInput">Tag Name<span className='astriek'>*</span><span className='space'style={{paddingLeft:'35px',fontWeight:'bold'}}>:</span></label></td>
                    <td><input
                      id="tagInput"
                      type="text"
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      required
                    /></td>
                  </tr>
                  <tr>
                    <td className='Tag'><label htmlFor="levelInput">No. of Levels<span className='astriek'>*</span><span className='space'style={{paddingLeft:'23px',fontWeight:'bold'}}>:</span></label></td>
                    <td><input
                      id="levelInput"
                      type="text"
                      required
                      value={count}
                      onChange={(e) => setCount(e.target.value)}
                    /></td>
                  </tr>
                  <tr>
                    <td className='Tag'><label htmlFor="objectiveInput">Tag Objective<span className='astriek'>*</span><span className='space'style={{paddingLeft:'10px',fontWeight:'bold'}}>:</span></label></td>
                    <td><input
                      id="objective"
                      type="text"
                      required
                      value={objective}
                      onChange={(e) => setobjective(e.target.value)}
                    /></td>
                  </tr>
                  <tr>
                    <td className='Tag'><label htmlFor="fileInput">Tag Picture<span className='astriek'>*</span><span className='space'style={{paddingLeft:"20px",fontWeight:'bold'}}>:</span></label></td>
                    <td>
                      <div {...getRootProps({ id: 'dropzone' })}>
                        <input {...getInputProps()} />
                        <p>{file ? file.name : 'Click to upload'}</p>
                      </div>
                    </td>
                  </tr>
                  {uploadedFilePath && (
                    <tr>
                      <td colSpan="2">
                        <img src={`http://localhost:5000${uploadedFilePath}`} alt="Uploaded" style={{ width: '100%' }} />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className='footer'>
              <button id="Cancel1" onClick={close}>CANCEL</button>
              <span style={{paddingLeft:"15px"}}></span>
              <button id="Add" onClick={handleOpenModal1}>ADD</button>
            </div>
          </div>
        </div>
      )}
      {isModal1Open && (
        <Modal1 close1={handleCloseModal1} file={handleAddButtonClick} />
      )}
    </>
  );
};

export default Modal;