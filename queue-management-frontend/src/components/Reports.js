import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Doughnut, Line } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function Reports({ goBack, tokensServed }) {
    const [operatorData, setOperatorData] = useState({});
    const [dailyTrendData, setDailyTrendData] = useState({});
    const [projectionData, setProjectionData] = useState({});

    useEffect(() => {
        axios.get('http://localhost:5000/report/operator-tokens')
            .then(response => setOperatorData(response.data))
            .catch(error => console.error('Error fetching operator data:', error));

        axios.get('http://localhost:5000/report/daily-trend')
            .then(response => {
                setDailyTrendData(response.data);
                calculateProjection(response.data);
            })
            .catch(error => console.error('Error fetching daily trend data:', error));
    }, []);

    const calculateProjection = (data) => {
        const dates = Object.keys(data);
        const pickedCounts = dates.map(date => data[date].picked);
        
        let totalIncrease = 0;
        for (let i = 1; i < pickedCounts.length; i++) {
            totalIncrease += pickedCounts[i] - pickedCounts[i - 1];
        }
        const averageIncrease = totalIncrease / (pickedCounts.length - 1);
        const projection = [...pickedCounts];

        for (let i = 0; i < 7; i++) {
            projection.push(projection[projection.length - 1] + averageIncrease);
        }
        setProjectionData(projection);
    };

    const prepareOperatorChartData = () => {
        const pickedCounts = Object.values(operatorData).map(data => data.picked);
        const completedCounts = Object.values(operatorData).map(data => data.completed);

        return {
            labels: ['Picked Tokens', 'Completed Tokens'],
            datasets: [
                {
                    label: 'Picked Tokens',
                    data: pickedCounts,
                    backgroundColor: '#36A2EB', 
                },
                {
                    label: 'Completed Tokens',
                    data: completedCounts,
                    backgroundColor: '#FFCE56', 
                },
            ],
        };
    };

    const prepareDailyTrendChartData = () => {
        const dates = Object.keys(dailyTrendData);
        const pickedCounts = dates.map(date => dailyTrendData[date].picked);
        const completedCounts = dates.map(date => dailyTrendData[date].completed);

        return {
            labels: dates,
            datasets: [
                {
                    label: 'Picked Tokens',
                    data: pickedCounts,
                    fill: false,
                    borderColor: '#36A2EB', 
                    tension: 0.1,
                },
                {
                    label: 'Completed Tokens',
                    data: completedCounts,
                    fill: false,
                    borderColor: '#FF6384', // Light Red for Completed Tokens
                    tension: 0.1,
                },
                {
                    label: 'Projected Tokens',
                    data: projectionData,
                    fill: false,
                    borderColor: '#FFA500', // Orange for Projected Tokens
                    borderDash: [5, 5],
                    tension: 0.1,
                },
            ],
        };
    };

    const downloadReport = () => {
        const report = new jsPDF("landscape");
        html2canvas(document.querySelector("#report"), { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL("image/png", 1.0);
            report.addImage(imgData, "PNG", 10, 10, 280, 190);
            report.setFontSize(10);
            report.setTextColor("#333");
            report.save("report.pdf");
        });
    };

    return (
        <div className="reports-container" id="report" style={styles.reportContainer}>
            <h2 style={styles.reportTitle}>Reports</h2>
            <div className="chart doughnut-chart-container" style={styles.chartContainer}>
                <h3 style={styles.chartTitle}>Operator Token Stats</h3>
                <Doughnut data={prepareOperatorChartData()} />
            </div>
            <div className="chart" style={styles.chartContainer}>
                <h3 style={styles.chartTitle}>Daily Token Trends and Projection</h3>
                <Line data={prepareDailyTrendChartData()} />
            </div>
            <div className="operator-tokens-table" style={styles.tableContainer}>
                <h3 style={styles.chartTitle}>Tokens Served by Each Operator</h3>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.tableHeaderRow}>
                            <th style={styles.tableHeaderCell}>Operator</th>
                            <th style={styles.tableHeaderCell}>Tokens Served</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(tokensServed).map(([operator, count]) => (
                            <tr key={operator} style={styles.tableRow}>
                                <td style={styles.tableCell}>{operator}</td>
                                <td style={styles.tableCell}>{count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button onClick={goBack} style={styles.backButton}>Back to Dashboard</button>
            <button onClick={downloadReport} style={styles.downloadButton}>Download Report</button>
        </div>
    );
}

const styles = {
    reportContainer: {
        fontFamily: 'Arial, sans-serif',
        color: '#333',
        padding: '20px',
    },
    reportTitle: {
        textAlign: 'center',
        fontSize: '24px',
        color: '#002366',
        marginBottom: '20px',
    },
    chartContainer: {
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
    },
    chartTitle: {
        textAlign: 'center',
        color: '#002366',
        fontSize: '18px',
    },
    tableContainer: {
        marginTop: '20px',
        marginBottom: '20px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    tableHeaderRow: {
        backgroundColor: '#002366',
        color: 'white',
    },
    tableHeaderCell: {
        padding: '10px',
        border: '1px solid #ddd',
    },
    tableRow: {
        backgroundColor: '#f9f9f9',
        borderBottom: '1px solid #ddd',
    },
    tableCell: {
        padding: '10px',
        textAlign: 'center',
        color: '#333',
    },
    backButton: {
        margin: '10px',
        padding: '10px 20px',
        fontSize: '14px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    downloadButton: {
        margin: '10px',
        padding: '10px 20px',
        fontSize: '14px',
        backgroundColor: '#002366',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
};
styles.backButton[':hover'] = { backgroundColor: '#5a6268' };
styles.downloadButton[':hover'] = { backgroundColor: '#001a4d' };

export default Reports;
