import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Reports from './Reports';

function OperatorDashboard({ showReports, onLogout }) {
    const [nextToken, setNextToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [queue, setQueue] = useState([]);
    const [selectedCounter, setSelectedCounter] = useState('Counter 1');
    const [viewReports, setViewReports] = useState(false);
    const [counterAssignments, setCounterAssignments] = useState({});
    const [operator, setOperator] = useState('Operator X');
    const [tokensServed, setTokensServed] = useState({ OperatorX: 0, OperatorY: 0, OperatorZ: 0 });

    useEffect(() => {
        fetchQueue();
    }, []);

    const fetchQueue = async () => {
        try {
            const response = await axios.get('http://localhost:5000/queue');
            setQueue(response.data);
        } catch (error) {
            console.error('Error fetching queue:', error);
        }
    };

    const fetchNextToken = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/next-token');
            if (response.data.token) {
                const newToken = response.data.token;
                setNextToken(newToken);
                setCounterAssignments((prev) => ({
                    ...prev,
                    [newToken]: selectedCounter,
                }));
                setTokensServed((prev) => ({
                    ...prev,
                    [operator.replace(" ", "")]: prev[operator.replace(" ", "")] + 1,
                }));
                announceToken(newToken, selectedCounter);
                fetchQueue();
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching next token:', error);
            alert('Failed to fetch next token. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const completeToken = async () => {
        if (!nextToken) return;
        try {
            const response = await axios.post('http://localhost:5000/complete-token', {
                token: nextToken,
            });
            alert(response.data.message);
            sayThankYou();
            setNextToken(null);
            fetchQueue();
        } catch (error) {
            console.error('Error completing token:', error);
            alert('Failed to mark token as complete. Please try again.');
        }
    };

    const announceToken = (token, counterName) => {
        if ('speechSynthesis' in window) {
            const message = new SpeechSynthesisUtterance(`Token ${token}. Please proceed to ${counterName}.`);
            window.speechSynthesis.speak(message);
        } else {
            console.warn("This browser does not support text-to-speech synthesis.");
        }
    };

    const sayThankYou = () => {
        if ('speechSynthesis' in window) {
            const message = new SpeechSynthesisUtterance("Thank you.");
            window.speechSynthesis.speak(message);
        }
    };

    const goBackToDashboard = () => {
        setViewReports(false);
    };

    return (
        <div className="dashboard-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            {viewReports ? (
                <Reports goBack={goBackToDashboard} tokensServed={tokensServed} />
            ) : (
                <div className="operator-dashboard" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#002366', color: 'white', padding: '10px', width: '100%' }}>
                        <h2 style={{ margin: 0 }}>Operator Dashboard</h2>
                        <button onClick={onLogout} style={{ color: 'white', backgroundColor: '#002366', border: 'none' }}>Logout</button>
                    </div>

                    <div className="dashboard-content" style={{ display: 'flex', marginTop: '20px', width: '100%' }}>
                        <div className="advertisement-section" style={{ flex: '1', paddingRight: '20px' }}>
                            <img src={`${process.env.PUBLIC_URL}/basil.png`} alt="Advertisement" style={{ width: '100%', height: 'auto', borderRadius: '10px' }} />
                        </div>

                        <div className="queue-details-section" style={{ flex: '1', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '10px', display: 'flex', flexDirection: 'column' }}>
                            <div className="operator-selection" style={{ marginBottom: '20px' }}>
                                <label>Select Operator:</label>
                                <select value={operator} onChange={(e) => setOperator(e.target.value)} style={{ marginLeft: '10px', padding: '5px' }}>
                                    <option value="Operator X">Operator X</option>
                                    <option value="Operator Y">Operator Y</option>
                                    <option value="Operator Z">Operator Z</option>
                                </select>
                            </div>

                            <div className="counter-selection" style={{ marginBottom: '20px' }}>
                                <label>Select Counter:</label>
                                <select value={selectedCounter} onChange={(e) => setSelectedCounter(e.target.value)} style={{ marginLeft: '10px', padding: '5px' }}>
                                    <option value="Counter 1">Counter 1</option>
                                    <option value="Counter 2">Counter 2</option>
                                    <option value="Counter 3">Counter 3</option>
                                </select>
                            </div>

                            <div className="dashboard-buttons" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                                <button onClick={fetchNextToken} disabled={loading} style={{ flex: 1, padding: '10px', backgroundColor: '#002366', color: 'white', borderRadius: '5px' }}>
                                    {loading ? 'Calling Next...' : 'CALL NEXT'}
                                </button>
                                <button onClick={completeToken} disabled={!nextToken} style={{ flex: 1, padding: '10px', backgroundColor: '#28a745', color: 'white', borderRadius: '5px' }}>
                                    COMPLETE
                                </button>
                                <button onClick={() => setViewReports(true)} style={{ flex: 1, padding: '10px', backgroundColor: '#6c757d', color: 'white', borderRadius: '5px' }}>
                                    View Reports
                                </button>
                            </div>

                            {nextToken && (
                                <div className="next-token-details" style={{ marginBottom: '20px', textAlign: 'center' }}>
                                    <h3 style={{ margin: '10px 0', color: '#002366' }}>Now Serving: {nextToken}</h3>
                                    <p style={{ margin: 0 }}>Assigned to: {counterAssignments[nextToken] || selectedCounter}</p>
                                    <p>Served by: {operator}</p>
                                </div>
                            )}

                            <div className="queue-list-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', textAlign: 'center' }}>
                                <h4 style={{ gridColumn: '1 / 3', color: '#002366' }}>Next in Queue</h4>
                                <span style={{ fontWeight: 'bold' }}>Counter</span>
                                <span style={{ fontWeight: 'bold' }}>Token</span>
                                {queue.length > 0 && (
                                    <React.Fragment>
                                        <span>{counterAssignments[queue[0].token] || 'Unassigned'}</span>
                                        <span>{queue[0].token}</span>
                                    </React.Fragment>
                                )}
                                {queue.length === 0 && <span>No tokens in queue</span>}
                            </div>
                        </div>
                    </div>

                    <div className="scrolling-text-section" style={styles.scrollingTextSection}>
                        <p style={styles.scrollingText}>Enjoy Super Sport 3 at only 90 KSH!!!</p>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    scrollingTextSection: {
        textAlign: 'center',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        marginTop: '20px',
        backgroundColor: '#002366',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
    },
    scrollingText: {
        display: 'inline-block',
        animation: 'scrolling 10s linear infinite',
    },
};

// Adding keyframes for scrolling animation
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
@keyframes scrolling {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
}`, styleSheet.cssRules.length);

export default OperatorDashboard;
