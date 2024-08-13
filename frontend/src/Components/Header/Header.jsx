import React, { useState } from 'react';
  import { useLocation } from 'react-router-dom';
  import './Header.css';
  import Modal from '../Dashboard/Modal';
  import { IoNotifications } from 'react-icons/io5';
  import Slidebar from './Slidebar';
  import { IoAddOutline } from "react-icons/io5";
  import { IoIosArrowRoundDown } from "react-icons/io";
  import Level from './level';

  const Header = ({ onAddTag }) => {
    const location = useLocation();
    const isDashboardPage = location.pathname === '/dashboard';
    const isNewPage = location.pathname === '/newpage';
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModal1Open, setIsModal1Open] = useState(false);

    return (
      <header className="header">
        <input className="search" placeholder="Search" type="text" />
        {isDashboardPage && (
          <button className="add-tag" onClick={() => setIsModalOpen(true)}>Add Tag</button>
        )}
        {isModalOpen && (
          <Modal close={() => setIsModalOpen(false)} addTag={onAddTag} />
        )}

        <div className='header-right'>
          {isNewPage && (
            <div className='icons'>
              <IoAddOutline className='new' onClick={() => setIsModal1Open(true)} />
              <IoIosArrowRoundDown className='download' />
            </div>
          )}
          {isModal1Open && (
            <Level close={() => setIsModal1Open(false)} />
          )}
          <div className="notify">
            <IoNotifications onClick={() => setIsSidebarOpen(true)} className="notify-icon" />
          </div>
        </div>
        {isSidebarOpen && (
          <Slidebar close={() => setIsSidebarOpen(false)} />
        )}
      </header>
    );
  };

  export default Header;