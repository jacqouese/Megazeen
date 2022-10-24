import { useReducer } from 'react';
import AddWarehouse from '../components/Warehouse/AddWarehouse';
import WarehouseList from '../components/Warehouse/WarehouseList';

function Warehouse() {
    const [update, forceUpdate] = useReducer((x) => x + 1, 0);

    return (
        <div className="my-sales">
            <div className="my-sales-inner">
                <AddWarehouse forceUpdate={forceUpdate} />
                <WarehouseList update={update} forceUpdate={forceUpdate} />
            </div>
        </div>
    );
}

export default Warehouse;
