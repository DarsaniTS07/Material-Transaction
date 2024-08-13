import React from 'react';
import { Link } from 'react-router-dom';
import "./Sidebar.css";
import { BiSolidDashboard } from "react-icons/bi";
import { IoPeople } from "react-icons/io5";
import { BiCalendarCheck } from "react-icons/bi";
import { MdInsertDriveFile } from "react-icons/md";
import { CiShare2 } from "react-icons/ci";
import { IoShareSocialSharp } from "react-icons/io5";

const Sidebar = () => {
  const isLoginPage = location.pathname === '/';
  return (
    {isLoginPage },
    <div className="sidebar">
      <div className="heading"></div>
      <hr />
      <nav> 
        <ul>
          <li>
            
            <Link to="/Upload" className="link">
            <BiSolidDashboard className='icon'/>
              <span className="text">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/People" className="link">
            <IoPeople className='icon'/>
              <span className="text">People</span>
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className="link">
            <MdInsertDriveFile className='icon'/>
              <span className="text">Tags</span>
            </Link>
          </li>
          <li>
            <Link to="/Approvals" className="link">
            <BiCalendarCheck className='icon' />
              <span className="text">Approvals</span>
            </Link>
          </li>
          <li>
            <Link to="/Sharing" className="link">
            <IoShareSocialSharp className='icon'/>
              <span className="text">Sharing</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;