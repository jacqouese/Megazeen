import { useReducer, useState } from 'react';
import AddSale from '../components/MySales/AddSale';
import EditSale from '../components/MySales/EditSale';
import ReturnSale from '../components/MySales/ReturnSale';
import SaleList from '../components/MySales/SaleList';
import StatsSale from '../components/MySales/StatsSale';

function MySales() {
    const [openEditSale, setOpenEditSale] = useState(false);
    const [openReturnSale, setOpenReturnSale] = useState(false);
    const [currentId, setCurrentId] = useState(0);
    const [update, forceUpdate] = useReducer((x) => x + 1, 0);

    return (
        <div className="my-sales">
            <EditSale open={openEditSale} setOpen={setOpenEditSale} currentId={currentId} forceUpdate={forceUpdate} />
            <ReturnSale
                open={openReturnSale}
                setOpen={setOpenReturnSale}
                currentId={currentId}
                forceUpdate={forceUpdate}
            />
            <div className="my-sales-inner">
                <AddSale forceUpdate={forceUpdate} />
                <StatsSale />
                <SaleList
                    update={update}
                    forceUpdate={forceUpdate}
                    setOpenEditSale={setOpenEditSale}
                    setOpenReturnSale={setOpenReturnSale}
                    setCurrentId={setCurrentId}
                />
            </div>
        </div>
    );
}

export default MySales;
