import React from "react";
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import './GetStartedButton.css';

export default function GetStartedButton() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/search'); 
    }


return (
    <div className="d-flex gap-2 mb-2">
        <Button variant="primary" size="lg" className='get-started-btn' onClick={handleClick}>
          Get Started
        </Button>
    </div>
);
}