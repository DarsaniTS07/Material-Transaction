import React from 'react';
import './Modal1.css'

const Modal1 = ({ close1, file }) => {
  const handleConfirm = () => {
    file();
    close1();
  };

  return (
    <div className='modal'>
      <div className='modal-container'>
        <div>
          <p>Are you sure you want to add this tag?<span className='asterik'>*</span></p>
        </div>
        <div className='footer'>
          <button id='No' onClick={close1}>NO</button>
          <span style={{paddingLeft:"15px"}}></span>
          <button id='Yes' onClick={handleConfirm}>YES</button>
        </div>
      </div>
    </div>
  );
};

export default Modal1;