import axios from 'axios';
import { useEffect, useState } from 'react';
import ContentLoader from 'react-content-loader';
import { getProfit } from '../../../../api/api';
import monthDateBounds from '../../../../helpers/monthDateBounds';
import Graph from '../../../_shared/Graph';

function StatsSaleMonth() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const bounds = monthDateBounds();
        getProfit(bounds[0], bounds[1]).then((res) => {
            setData(res.data);
            setLoading(false);
        });
    }, []);

    const LoadingAnimation = () => (
        <ContentLoader viewBox="0 0 500 120">
            <rect x="0" y="0" rx="5" ry="5" width="100%" height="100%" />
        </ContentLoader>
    );

    const bars = [60, 86, 65, 25, 80, 70];

    return (
        <div className="stats-sale-month-container">
            <div className="stats-sale-month-inner">
                <div className="stats-sale-month-top">
                    <div>
                        <p>Obrót w tym miesiącu</p>
                        {loading ? (
                            <LoadingAnimation />
                        ) : (
                            <h1>{data.turnover}</h1>
                        )}
                    </div>
                    <Graph data={bars} />
                </div>
                <div className="stats-sale-month-bottom">
                    <p>
                        Sprzedano: <br />
                        <span className="bold">{data.number}</span> szt
                    </p>
                    <p>
                        Zarobek: <br />
                        <span className="bold">{data.profit}</span> zł
                    </p>
                </div>
            </div>
        </div>
    );
}

export default StatsSaleMonth;
