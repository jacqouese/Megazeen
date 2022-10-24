import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getProfitForYear } from '../../../api/api';
import { CircularProgress } from '@mui/material';

function MonthlyStats() {
    const [loading, setLoading] = useState(true);
    const [monthData, setMonthData] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [turnover, setTurnover] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    const [numberOfSold, setNumberOfSold] = useState(0);

    const [labels, setLabels] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
                position: 'top',
            },
            title: {
                display: false,
                text: 'Chart.js Bar Chart',
            },
        },
    };

    const data = {
        labels,
        datasets: [
            {
                label: 'Zarobek',
                data: monthData,
                backgroundColor: 'rgba(255, 99,  132, 1)',
            },
            {
                label: 'Obrót',
                data: turnover,
                backgroundColor: 'rgba(54, 162, 235, 1)',
            },
        ],
    };

    useEffect(() => {
        getProfitForYear().then((res) => {
            const temporaryMonthData = [];
            const temporaryTurnover = [];
            setLabels(res.data[0]);

            res.data[1].forEach((elem) => {
                temporaryMonthData.push(elem.ProfitSum ? elem.ProfitSum : 0);
                temporaryTurnover.push(elem.Turnover ? elem.Turnover : 0);
            });

            setMonthData(temporaryMonthData);
            setNumberOfSold(res.data[1][11].numberof);
            setTurnover(temporaryTurnover);
            setLoading(false);
        });
    }, []);

    return (
        <div className="monthly-stats-container inner-container">
            <h3 className="title">Miesięczna sprzedaż</h3>
            {loading ? (
                <div className="monthly-stats-loading">
                    <CircularProgress />
                </div>
            ) : (
                <div className="monthly-stats-inner">
                    <div className="monthly-stats-graph">
                        <Bar options={options} data={data} />
                    </div>
                    <div className="monthly-stats-numbers">
                        <div>
                            <p className="montly-stats-p-larger">
                                <span className="bold">{numberOfSold}</span> szt
                            </p>
                            <p className="lighter">Sprzedano</p>
                        </div>
                        <div>
                            <p className="montly-stats-p-larger">
                                <span className="bold">{monthData[11]}</span> zł
                            </p>
                            <p className="lighter">Zarobek</p>
                        </div>
                        <div>
                            <p className="montly-stats-p-larger">
                                <span className="bold">{turnover[11]}</span> zł
                            </p>
                            <p className="lighter">Obrót</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MonthlyStats;
