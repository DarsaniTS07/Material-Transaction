import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Components/Sidebar/Sidebar';
import Header from './Components/Header/Header';
import Dashboard from './Components/Dashboard/Dashboard';
import Upload from './Components/Upload/Upload';
import People from './Components/People/People';
import Newpage from './Components/NewPage/newpage';
import Approvals from './Components/Approvals/Approvals';
import Login from './Components/Login/Login';
import Sharing from './Components/Sharing/Sharing';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={
            <>
              <Sidebar />
              <div className="main-content">
                <Header />
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/upload" element={<Upload />} />
                  <Route path="/people" element={<People />} />
                  <Route path="/newpage" element={<Newpage />} />
                  <Route path="/approvals" element={<Approvals />} />
                  <Route path="/sharing" element={<Sharing />} />
                  <Route path="*" element={<div>404 Not Found</div>} />
                </Routes>
              </div>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;