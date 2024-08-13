import React, { useState, useEffect } from 'react';
import './EditTag.css';

const Edit_Tag = ({ close, confirm, tagData }) => {
  const [tagName, setTagName] = useState(tagData.tag || '');
  const [count, setCount] = useState(tagData.count || '');

  useEffect(() => {
    setTagName(tagData.tag || '');
    setCount(tagData.count || '');
  }, [tagData]);

  const handleConfirm = () => {
    confirm({ ...tagData, tag: tagName, count });
    close();
  };

  return (
    <div className='custom-modal2'>
      <div className='custom-modal2-container'>
        <div className='custom-modal2-header'>
          <h3>EDIT TAG</h3>
        </div>
        <div className='custom-modal2-body'>
          <label>
            Tag Name<span style={{paddingLeft:'45px',fontWeight:'bold'}}>:</span>
            <input type='text' value={tagName} onChange={(e) => setTagName(e.target.value)} />
          </label>
          <br></br>
          <label>
            No. of Levels<span style={{paddingLeft:'30px',fontWeight:'bold'}}>:</span>
            <input type='number' value={count} onChange={(e) => setCount(e.target.value)} />
          </label>
        </div>
        <div className='custom-modal2-footer'>
          <button className='can' onClick={close}>CANCEL</button>
          <button className='con'onClick={handleConfirm}>EDIT</button>
        </div>
      </div>
    </div>
  );
};

export default Edit_Tag;