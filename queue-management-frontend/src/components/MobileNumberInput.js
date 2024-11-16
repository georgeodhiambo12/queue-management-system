import React, { useState } from 'react';

function MobileNumberInput({ onProceed }) {
    const [mobileNumber, setMobileNumber] = useState('+254');

    const handleProceed = () => {
        if (mobileNumber.length >= 10) {
            onProceed(mobileNumber); 
        } else {
            alert('Please enter a valid mobile number.');
        }
    };

    return (
        <div className="mobile-number-input-screen">
            <h2>Please enter mobile number to get a token</h2>
            <div className="input-group">
                <input
                    type="text"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="Enter mobile number"
                    className="mobile-input"
                />
            </div>
            <button onClick={handleProceed} className="proceed-button">
                Proceed
            </button>
        </div>
    );
}

export default MobileNumberInput;
