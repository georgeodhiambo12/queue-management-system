import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MasterDisplay.css';

function MasterDisplay() {
    const [currentToken, setCurrentToken] = useState(null);
    const [audio] = useState(new Audio('/audio/announcement.mp3')); 

    useEffect(() => {
        const interval = setInterval(() => {
            fetchCurrentToken();
        }, 5000); 

        return () => clearInterval(interval); 
    }, []);

    const fetchCurrentToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/next-token');
            if (response.data.token !== currentToken?.token) {
                setCurrentToken(response.data);
                playAudioAnnouncement();
            }
        } catch (error) {
            console.error('Error fetching current token:', error);
        }
    };

    const playAudioAnnouncement = () => {
        audio.play().catch(error => console.error('Error playing audio:', error));
    };

    return (
        <div className="master-display">
            <div className="counter-token-display">
                <h2>Counter 1</h2>
                <h1>{currentToken ? currentToken.token : 'Waiting...'}</h1>
            </div>
            <div className="advertisement">
                <img src="/images/advertisement.jpg" alt="Advertisement" />
            </div>
            <div className="scrolling-text">
                <p>Enjoy Super Sport 3 at only 90 KSH!!!</p>
            </div>
        </div>
    );
}

export default MasterDisplay;
