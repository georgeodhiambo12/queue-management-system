const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const africastalking = require('africastalking')({
    apiKey: 'atsk_16f7d8baf8a789aea8d6b61e8e4bb57b9fd874ee4d2c23d0048bfa2611789f07a1a2ba9a',
    username: 'sandbox',
});

const app = express();
const sms = africastalking.SMS;

app.use(cors());
app.use(bodyParser.json());

let tokenQueue = [];
let currentToken = 0;
let operatorData = {}; 
let dailyTrendData = {}; 

// Helper function to format date and time
function formatDateTime(date) {
    const options = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true 
    };
    return date.toLocaleString('en-US', options).replace(/,/, '');
}

// Helper function to validating of the phone number
function isValidPhoneNumber(phoneNumber) {
    const phoneRegex = /^\+\d{10,15}$/; 
    return phoneRegex.test(phoneNumber);
}

// Root route to check if the server is running
app.get('/', (req, res) => {
    res.send('Queue Management Backend Server is running.');
});

// Endpoint to generating a token
app.post('/generate-token', (req, res) => {
    const { phoneNumber, serviceType, operator = 'Unknown' } = req.body;

    // Validating the phone number format +254
    if (!isValidPhoneNumber(phoneNumber)) {
        return res.status(400).json({ message: 'Invalid phone number format. Use format: +1234567890' });
    }

    currentToken++;
    const token = `A${currentToken.toString().padStart(3, '0')}`;
    const dateTime = formatDateTime(new Date());
    const dateOnly = dateTime.split(' ')[0];

    // Updating the queue and statistics
    tokenQueue.push({ token, phoneNumber, serviceType, dateTime, operator, completed: false });

    // Updating operator data
    if (!operatorData[operator]) {
        operatorData[operator] = { picked: 0, completed: 0 };
    }
    operatorData[operator].picked++;

    // Updating daily trend of data
    if (!dailyTrendData[dateOnly]) {
        dailyTrendData[dateOnly] = { picked: 0, completed: 0 };
    }
    dailyTrendData[dateOnly].picked++;

    // Sending SMS as required/stated
    sms.send({
        to: [phoneNumber],
        message: `Your token number is ${token}. Please proceed to the service desk for ${serviceType}.`
    }).then(response => {
        console.log("SMS sent successfully:", JSON.stringify(response, null, 2));
        res.status(200).json({ token, serviceType, dateTime, message: 'Token generated and SMS sent.' });
    }).catch(error => {
        console.error("Error sending SMS:", error);
        res.status(500).json({ message: 'Failed to send SMS.' });
    });
});

// Endpoint to Getting the Next Token (Peek without removing)
app.get('/next-token', (req, res) => {
    if (tokenQueue.length > 0) {
        const nextToken = tokenQueue[0]; 
        res.status(200).json(nextToken);
    } else {
        res.status(200).json({ message: 'No more tokens in queue.' });
    }
});

// Endpoint to Mark Token as Complete
app.post('/complete-token', (req, res) => {
    const { token } = req.body;

    // Checking if the token exists in the queue
    const tokenIndex = tokenQueue.findIndex(item => item.token === token);
    if (tokenIndex !== -1) {
        const tokenData = tokenQueue[tokenIndex];
        tokenData.completed = true;
        const dateOnly = tokenData.dateTime.split(' ')[0];

        // Updating the operator and daily trend data as needed by the task
        operatorData[tokenData.operator].completed++;
        dailyTrendData[dateOnly].completed++;

        // Removng the token from queue asap
        tokenQueue.splice(tokenIndex, 1);
        console.log(`Token ${token} marked as complete.`);
        res.status(200).json({ message: `Token ${token} marked as complete.` });
    } else {
        res.status(404).json({ message: 'Token not found in queue.' });
    }
});

app.get('/queue', (req, res) => {
    res.status(200).json(tokenQueue);
});

// Endpoint to fetch operator-wise token statistics
app.get('/report/operator-tokens', (req, res) => {
    res.status(200).json(operatorData);
});

// Endpoint to fetch daily trend data
app.get('/report/daily-trend', (req, res) => {
    res.status(200).json(dailyTrendData);
});

// Starting the Server at localhost 5000
app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
