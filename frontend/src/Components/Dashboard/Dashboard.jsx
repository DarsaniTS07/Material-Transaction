import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [tags, setTags] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tags');
      setTags(response.data);
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  };
  useEffect(() => {
    fetchTags(); 
    const intervalId = setInterval(() => {
      fetchTags();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleClick = (tag) => {
    navigate('/newpage', { state: { message: tag } });
  };

  const handleAddTag = async (newTag) => {
    try {
      
      setTags(prevTags => [...prevTags, newTag]);
    } catch (err) {
      console.error('Error adding tag:', err);
    }
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      <div className="tags">
        <div className='tag-container'>
          {tags.map((tag, index) => (
            <div key={tag.id || index} className='tag-card' onClick={() => handleClick(tag)}>
              <img src={`http://localhost:5000/${tag.image}`} alt="Tag" onError={(e) => console.log('Image error', e)} />
              <div className='tag-info'>
                <p>{tag.tag}</p>
                <p>Levels: {tag.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;