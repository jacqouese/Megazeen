import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { CircularProgress } from '@mui/material';
import { getBestPerforming } from '../../../api/api';
import searchImg from '../../../assets/search.png';

function CircleStats() {
    const [loading, setLoading] = useState(true);
    const [labels, setLabels] = useState([]);
    const [chartData, setChartData] = useState([]);

    ChartJS.register(ArcElement, Tooltip, Legend);

    const data = {
        labels: labels,
        datasets: [
            {
                label: '# of Votes',
                data: chartData,
                backgroundColor: [
                    'rgba(255, 99,  132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(53, 102, 255, 1)',
                ],
                borderWidth: 0,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                align: 'start',
            },
        },
    };

    useEffect(() => {
        getBestPerforming().then((res) => {
            let products = [];
            let profitValue = [];
            res.data.forEach((elem) => {
                products.push(elem.ProductName);
                profitValue.push(elem.profit_sum);
            });
            setLabels(products);
            setChartData(profitValue);
            setLoading(false);
        });
    }, []);

    return (
        <div className="circle-stats-container inner-container">
            <h3 className="title">Najlepiej zarabiające</h3>
            {loading ? (
                <div className="monthly-stats-loading">
                    <CircularProgress />
                </div>
            ) : chartData.length ? (
                <div className="circle-stats-inner" style={{ width: 240, paddingTop: 20 }}>
                    <Doughnut data={data} options={options} />
                </div>
            ) : (
                <div className="no-results-container">
                    <img src={searchImg} alt="" />
                    <p>Brak danych</p>
                </div>
            )}
        </div>
    );
}

export default CircleStats;
