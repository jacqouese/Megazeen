import React, { useEffect, useState } from 'react';
import ContentLoader from 'react-content-loader';

import { getProfit } from '../../../../api/api';
import today from '../../../../helpers/today';

function StatsSaleDay() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const LoadingAnimation = () => (
        <ContentLoader viewBox="0 0 500 120">
            <rect x="0" y="0" rx="5" ry="5" width="100%" height="100%" />
        </ContentLoader>
    );

    useEffect(() => {
        getProfit(today(), today()).then((res) => {
            setData(res.data);
            setLoading(false);
        });
    }, []);

    return (
        <div className="stats-sale-top">
            <div className="stats-sale-top-left">
                <p>obrot dzisiaj</p>
                <div>
                    {loading ? <LoadingAnimation /> : <h3 className="color-priamry-light">{data.turnover} zł</h3>}
                </div>
            </div>
            <div className="stats-sale-top-right">
                <div className="stats-sale-top-right-element">
                    <p>sprzedano</p>
                    <div>{loading ? <LoadingAnimation /> : <h3>{data.number} szt</h3>}</div>
                </div>
                <div className="stats-sale-top-right-element">
                    <p>zarobek</p>
                    <div>{loading ? <LoadingAnimation /> : <h3>{data.profit} zł</h3>}</div>
                </div>
            </div>
        </div>
    );
}

export default StatsSaleDay;
