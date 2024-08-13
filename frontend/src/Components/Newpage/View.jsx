import React, { useEffect, useRef } from 'react';
import './View.css';

const View = ({ close, level, tag }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [close]);

  return (
    <div className='custom-modal'>
      <div className='custom-modal-container' ref={modalRef}>
        <div className='custom-modal-header'>
          <header className='viewheader'>
            <input placeholder='Search' type='text'></input>
            <div className='head_end'>
            <button>ADD</button>
            <span style={{paddingLeft:"15px"}}></span>
            <button>SORT BYTYPE</button>
            </div>
          </header>
        </div>
        <div className='custom-modal-content'>
          <p>{tag} | Level: {level?.level}</p>
        </div>
        <div className='custom-modal-footer'>
          <button type='button' onClick={close}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default View;