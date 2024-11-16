import React, { useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';

function TokenForm({ mobileNumber }) {
    const [serviceType, setServiceType] = useState('');
    const [loading, setLoading] = useState(false);
    const [tokenDetails, setTokenDetails] = useState(null);

    const handleServiceSelect = (service) => {
        setServiceType(service);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!serviceType) {
            alert("Please select a service type.");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/generate-token', {
                phoneNumber: mobileNumber,
                serviceType
            });
            setTokenDetails({
                token: response.data.token,
                serviceType: response.data.serviceType,
                dateTime: response.data.dateTime
            });
            alert(response.data.message);
        } catch (error) {
            console.error('Error generating token:', error);
            alert('Failed to generate token. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = () => {
        if (tokenDetails) {
            const doc = new jsPDF();
            doc.setFontSize(20);
            doc.text("Multichoice Token Details", 20, 20);
            doc.setFontSize(12);
            doc.text(`Service Type: ${tokenDetails.serviceType}`, 20, 40);
            doc.text(`Token Number: ${tokenDetails.token}`, 20, 50);
            doc.text(`Date & Time: ${tokenDetails.dateTime}`, 20, 60);
            doc.save(`${tokenDetails.token}_Token.pdf`);
        }
    };

    return (
        <div className="token-form-screen">
            {tokenDetails ? (
                <div className="token-display">
                    <img src={`${process.env.PUBLIC_URL}/multichoice.png`} alt="Multichoice Logo" className="logo" />
                    <h2>Multichoice</h2>
                    <p>{tokenDetails.serviceType}</p>
                    <p><strong>{tokenDetails.token}</strong></p>
                    <p>{tokenDetails.dateTime}</p>
                    <button onClick={handleDownloadPDF} className="download-button">
                        Download Token as PDF
                    </button>
                </div>
            ) : (
                <>
                    <h2>Please select the service you require</h2>
                    <div className="service-buttons">
                        <button
                            type="button"
                            className={`service-button ${serviceType === 'Decoder Renewal' ? 'active' : ''}`}
                            onClick={() => handleServiceSelect('Decoder Renewal')}
                        >
                            Decoder Renewal
                        </button>
                        <button
                            type="button"
                            className={`service-button ${serviceType === 'General Enquiries' ? 'active' : ''}`}
                            onClick={() => handleServiceSelect('General Enquiries')}
                        >
                            General Enquiries
                        </button>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="generate-button"
                    >
                        {loading ? 'Generating...' : 'Generate Token'}
                    </button>
                </>
            )}
        </div>
    );
}

export default TokenForm;
