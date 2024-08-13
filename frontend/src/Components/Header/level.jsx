import React, { useState, useEffect } from 'react';
import './level.css';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Level = ({ close }) => {
  const [content, setContent] = useState("");
  const [level, setLevel] = useState("");
  const [main_id, setMainId] = useState("");
  const [isModal1Open, setIsModal1Open] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message?.id) {
      setMainId(location.state.message.id);
    }
  }, [location.state?.message?.id]);

  const handleAddButtonClick = async () => {
    const form1Data = new FormData();
    form1Data.append('content', content);
    form1Data.append('level', level);
    form1Data.append('main_id', location.state.message.id);

    try {
      const res = await axios.post('http://localhost:5000/addlevel', { main_id, content, level });
      console.log(res.data);
      close();
    } catch (err) {
      console.error('Error while adding level:', err.response ? err.response.data : err.message);
    }
  };

  const handleClick = () => {
    console.log(location.state.message.id);
    handleAddButtonClick();
    setIsModal1Open(true);
  };

  return (
    <>
      {!isModal1Open && (
        <div className='modal'>
          <div className='modal-container'>
            <div className='header1'>
              <h2>ADD LEVELS</h2>
            </div>
            <div>
              <table>
                <tbody>
                  <tr>
                    <td><label htmlFor="contentInput">Content Name<span className='asterick'>*</span><span style={{paddingLeft:'10px'}}>:</span></label></td>
                    <td><input
                      id="contentInput"
                      type="text"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                      className='input-field'
                    /></td>
                  </tr>
                  <tr>
                    <td><label htmlFor="levelInput">Level No<span className='asterick'>*</span><span style={{paddingLeft:'57px'}}>:</span></label></td>
                    <td><input
                      id="levelInput"
                      type="text"
                      required
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className='input-field'
                    /></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className='footer'>
              <button id='Cancel' onClick={close}>CANCEL</button>
              <span style={{paddingLeft:"15px"}}></span>
              <button id='Add' onClick={handleClick}>ADD</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Level;
