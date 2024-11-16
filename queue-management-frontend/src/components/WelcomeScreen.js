import React from 'react';

function WelcomeScreen({ onProceed }) {
    return (
        <div className="welcome-screen" style={styles.container}>
            <h1 style={styles.welcomeMessage}>Welcome Client, we are happy to have you on board!</h1>
            <p style={styles.subText}>Karibu sana!</p>
            <h2 style={styles.subtitle}>Multichoice, your happiness is our happiness</h2>
            <button onClick={onProceed} style={styles.proceedButton}>Proceed</button>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f8ff',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        padding: '20px',
        boxSizing: 'border-box',
        overflow: 'hidden', 
    },
    welcomeMessage: {
        fontSize: '24px', 
        color: 'green', 
        marginBottom: '8px',
        fontStyle: 'italic', 
        fontWeight: 'bold', 
    },
    subText: {
        fontSize: '16px', 
        color: '#555',
        marginBottom: '16px',
    },
    subtitle: {
        fontSize: '20px', 
        color: '#333',
        marginBottom: '24px',
    },
    proceedButton: {
        padding: '10px 20px', 
        fontSize: '16px', 
        backgroundColor: '#002366',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
};

styles.proceedButton[':hover'] = {
    backgroundColor: '#001a4d',
};

export default WelcomeScreen;
