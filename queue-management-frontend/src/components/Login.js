import React, { useState } from 'react';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        if (username === 'georgeodhiambo12' && password === '123456') {
            onLogin();
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="login-container" style={styles.container}>
            <h2 style={styles.title}>Operator Login</h2>
            {error && <p style={styles.error}>{error}</p>}
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
            />
            <button onClick={handleLogin} style={styles.button}>Login</button>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '400px',
        margin: '50px auto',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f5f5f5',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        fontSize: '24px',
        color: '#333',
        marginBottom: '20px',
    },
    error: {
        color: 'red',
        fontSize: '14px',
        marginBottom: '10px',
    },
    input: {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '16px',
    },
    button: {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: '#002366',
        color: 'white',
        border: 'none',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '10px',
    },
};

export default Login;
