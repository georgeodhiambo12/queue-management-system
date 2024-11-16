import React, { useState } from 'react';
import './App.css';
import MobileNumberInput from './components/MobileNumberInput';
import TokenForm from './components/TokenForm';
import OperatorDashboard from './components/OperatorDashboard';
import Reports from './components/Reports';
import Login from './components/Login';
import WelcomeScreen from './components/WelcomeScreen';

function App() {
    const [step, setStep] = useState(1);
    const [mobileNumber, setMobileNumber] = useState('');
    const [view, setView] = useState('welcome');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleProceed = (number) => {
        setMobileNumber(number);
        setStep(2);
    };

    const showMainView = () => {
        setView('main');
    };

    const handleLogin = () => {
        setIsLoggedIn(true);
        setView('operatorDashboard');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setView('login'); 
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <img src={`${process.env.PUBLIC_URL}/multichoice.png`} alt="Multichoice Logo" style={styles.logo} />
                <h1 style={styles.title}>Queue Management System</h1>
            </header>
            
            {view === 'welcome' && <WelcomeScreen onProceed={() => setView('main')} />}

            {view === 'main' && (
                <>
                    {step === 1 && <MobileNumberInput onProceed={handleProceed} />}
                    {step === 2 && (
                        <>
                            <TokenForm mobileNumber={mobileNumber} isLoggedIn={isLoggedIn} />
                            {!isLoggedIn && (
                                <button onClick={() => setView('login')} style={styles.operatorButton}>
                                    Operator Dashboard
                                </button>
                            )}
                        </>
                    )}
                </>
            )}
            
            {view === 'login' && !isLoggedIn && <Login onLogin={handleLogin} />}
            
            {isLoggedIn && view === 'operatorDashboard' && (
                <>
                    <button onClick={showMainView} style={styles.backButton}>Back to Main</button>
                    <OperatorDashboard showReports={() => setView('reports')} onLogout={handleLogout} />
                </>
            )}
            
            {view === 'reports' && (
                <>
                    <button onClick={() => setView('operatorDashboard')} style={styles.backButton}>Back to Dashboard</button>
                    <Reports />
                </>
            )}
        </div>
    );
}

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        backgroundColor: '#f0f8ff',
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '20px', 
    },
    logo: {
        width: '120px', 
        height: 'auto',
        marginBottom: '5px', 
    },
    title: {
        fontSize: '24px', 
        color: '#002366',
        textAlign: 'center',
        margin: 0, 
    },
    operatorButton: {
        marginTop: '20px',
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#002366',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    backButton: {
        margin: '20px 0',
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
};

styles.operatorButton[':hover'] = {
    backgroundColor: '#001a4d',
};

styles.backButton[':hover'] = {
    backgroundColor: '#5a6268',
};

export default App;
