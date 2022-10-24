import StatsSaleDay from './StatsSaleDay';
import StatsSaleMonth from './StatsSaleMonth';

function StatsSale() {
    return (
        <div className="stats-sale-container">
            <StatsSaleDay />
            <StatsSaleMonth />
        </div>
    );
}

export default StatsSale;
