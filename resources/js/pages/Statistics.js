import { useReducer } from 'react';
import CircleStats from '../components/Statistics/CircleStats';
import MonthlyStats from '../components/Statistics/MonthlyStats';
import Returns from '../components/Statistics/Returns';
import NewStatement from '../components/Statistics/NewStatement';
import StatsSaleDay from '../components/MySales/StatsSale/StatsSaleDay';
import ProductStock from '../components/Statistics/ProductStock';

function Statistics() {
    const [update, forceUpdate] = useReducer((x) => x + 1, 0);

    return (
        <div className="my-sales">
            <div className="my-sales-inner">
                <div className="daily-stats-container">
                    <StatsSaleDay />
                </div>
                <Returns />
                <MonthlyStats />
                <CircleStats />
                <ProductStock />
                <NewStatement />
            </div>
        </div>
    );
}

export default Statistics;
