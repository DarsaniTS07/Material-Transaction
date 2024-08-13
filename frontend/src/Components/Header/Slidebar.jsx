import React, { useState, useEffect } from 'react';
import './Slidebar.css';

const Slidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 1000); 

        return () => clearTimeout(timer); 
    }, []);

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('overlay')) {
            handleClose();
        }
    };

    return (
        <div className={`overlay ${isOpen ? 'open' : ''}`} onClick={handleOverlayClick}>
            <div className={`slidebar ${isOpen ? 'open' : ''}`}>
                <h2>Slidebar</h2>
                <p>This is a sliding popup modal.</p>
                <button onClick={handleClose}>Close</button>
            </div>
        </div>
    );
};

export default Slidebar;