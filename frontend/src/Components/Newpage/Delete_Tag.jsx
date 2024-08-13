import React from 'react';
import './Delete_Tag.css';

const Delete_Tag = ({ close, confirm }) => {
  const handleConfirm = () => {
    confirm();
    close();
  };

  return (
    <div className='custom-modal1'>
      <div className='custom-modal1-container'>
        <div className='custom-modal1-header'>
          
          <p>Are you sure you in removing this tag?</p>
        </div>
        <div className='custom-modal1-footer'>
          <button id='del' onClick={close}>NO</button>
          <button id='sel'onClick={handleConfirm}>YES</button>
        </div>
      </div>
    </div>
  );
};

export default Delete_Tag;