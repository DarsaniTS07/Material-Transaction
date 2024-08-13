import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './newpage.css';
import { IoEyeSharp } from "react-icons/io5";
import View from "./View";
import Modal1 from './Delete_Tag';
import Modal2 from './EditTag';

const NewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [level, setLevel] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tagData, setTagData] = useState({ tag: '', count: '' });
  const [deltag, setDeltag] = useState(false);
  const [content, setContent] = useState([]);

  useEffect(() => {
    fetchTags();
    fetchContent();
  }, []);

  useEffect(() => {
    fetchTags(); 
    const intervalId = setInterval(() => {
      fetchTags();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchTags = async () => {
    try {
      const response = await axios.get('http://localhost:5000/addlevel');
      setLevel(response.data);
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  };

  const fetchContent = async () => {
    try {
      const response = await axios.get('http://localhost:5000/addcontent');
      setContent(response.data);
    } catch (err) {
      console.error('Error fetching content:', err);
    }
  };

  const handleOpenModal = (level) => {
    setSelectedLevel(level);
    setIsModalOpen(true);
  };

  const handleLinkClick = (e, level) => {
    e.preventDefault();
    handleOpenModal(level);
  };

  const handleEditClick = () => {
    const { tag, count } = location.state.message;
    setTagData({ tag: tag || '', count: count || '' });
    setIsEditModalOpen(true);
  };

  const handleConfirmEdit = async (updatedData) => {
    try {
      const { id } = location.state.message;
      if (!updatedData.tag || !updatedData.count) {
        throw new Error('Tag and count are required.');
      }

      await axios.put(`http://localhost:5000/edittag/${id}`, updatedData);

      const updatedMessage = { ...location.state.message, ...updatedData };
      location.state.message = updatedMessage;

      setIsEditModalOpen(false);
      setTagData(updatedMessage);
    } catch (err) {
      console.error('Error updating tag:', err);
    }
  };

  const handleDeleteTag = async () => {
    try {
      const { id } = location.state.message;
      await axios.delete(`http://localhost:5000/deletetag/${id}`);
      setDeltag(false);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error deleting tag:', err);
    }
  };

  const handleAddTag = async (newTagData) => {
    try {
      const response = await axios.post('http://localhost:5000/addtag', newTagData);
      const newTag = response.data;

      const updatedTags = [...level, newTag];
      setLevel(updatedTags);
    } catch (err) {
      console.error('Error adding new tag:', err);
    }
  };

  const handleAddLevelContent = async (newLevelData) => {
    try {
      const response = await axios.post('http://localhost:5000/addlevelcontent', newLevelData);
      const newLevel = response.data;

      const updatedLevel = [...level, newLevel];
      setLevel(updatedLevel);
    } catch (err) {
      console.error('Error adding new level content:', err);
    }
  };

  return (
    <div className='page'>
      <div className='first'>
        <p className='name' style={{marginTop:'-13px'}}>{location.state.message.tag}</p>
        <p className='materials'>Materials</p>
        {location.state?.message && (
          <div className='inner-container'>
            <div className='contain'>
              <p className='innerTag'>{location.state.message.tag}</p>
            </div>
            <img src={`http://localhost:5000/${location.state.message.image}`} alt="" />
            <p className='innerObjective'>Objective: {location.state.message.objective}</p>
          </div>
        )}
        <div className='actions'>
          <div className='action-head'><p>Actions</p></div>
          <button onClick={handleEditClick} className='edit'>Edit Tag</button>
          <button onClick={() => setDeltag(true)} className='remove'>Remove Tag</button>
        </div>
        {deltag && (
          <Modal1 close={() => setDeltag(false)} confirm={handleDeleteTag} />
        )}
        {isEditModalOpen && (
          <Modal2 close={() => setIsEditModalOpen(false)} confirm={handleConfirmEdit} tagData={tagData} />
        )}
      </div>

      <div>
        <div className='find' >
          <input type='search' placeholder='Search' className=''></input>
        </div>
        <form>
          <table>
            <thead>
              <tr className='levelheading' style={{marginTop:'-20px'}}>
                <td style={{width:'20px',textAlign:'center',fontWeight:'540'}}>S.No</td>
                <td style={{width:'100px',textAlign:'center',fontWeight:'540'}}>Tag Level</td>
                <td style={{width:'200px',textAlign:'center',fontWeight:'540'}}>Content Name</td>
                <td style={{width:'30px',textAlign:'center',fontWeight:'540'}}>Actions</td>
                <td style={{width:'30px',textAlign:'center',fontWeight:'540'}}>Links</td>
              </tr>
              </thead>
             <tbody className='level-container'>
                {level.map((lvl, index) => (
                  location.state?.message.id === lvl.main_id && (
                    <tr className='level' key={index} style={{marginTop:'-3px'}} >
                      <td style={{width:'20px',textAlign:'center'}}>{lvl.id}</td>
                      <td style={{width:'100px',textAlign:'center'}}>Level {lvl.level}</td>
                      <td style={{width:'240px',textAlign:'center'}}>{lvl.content}</td>
                      <td style={{width:'50px',textAlign:'center'}}>
                        <button onClick={() => handleOpenModal(lvl)} id='view'>VIEW</button>
                      </td>
                      <td style={{width:'30px',textAlign:'center'}}>
                        <button onClick={(e) => handleLinkClick(e, lvl)} id='links'>LINKS</button>
                      </td>
                    </tr>
                   
                  )
                ))}
            
              {isModalOpen && (
                <View close={() => setIsModalOpen(false)} level={selectedLevel} tag={location.state.message.tag} />
              )}
              </tbody>
          </table>
        </form>
      </div>
    </div>
  );
};

export default NewPage;