import { useContext, useEffect, useState } from 'react';
import { addCollection, addWarehouse, getProducts, getShippingOptions } from '../../../api/api';
import today from '../../../helpers/today';

import { createNotification } from '../../../services/notification';
import { Autocomplete, Button, IconButton, TextField, Tooltip } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DeleteIcon } from '../../../assets/DeleteIcon.js';
import convertFullDateToSqlFormat from '../../../helpers/convertFullDateToSqlFormat';

function AddWarehouse(props) {
    const [products, setProducts] = useState([]);
    const [variants, setVariants] = useState([]);

    const [name, setName] = useState('RK61');
    const onChangeName = (item) => {
        // after user chooses item in select
        setName(item.value);

        // load the right variant for product
        const formatedVariants = item.variants.map((variant) => {
            return { label: variant.VariantName, value: variant.VariantName };
        });

        setVariants(formatedVariants);
    };

    const onChangeVariant = (item) => {
        // after user chooses item in select
        setVariant(item.value);
    };

    const prepareProducts = (products) => {
        const formatedProducts = [];
        products.forEach((product) => {
            formatedProducts.push({
                label: product.ProductName,
                value: product.ProductName,
                variants: product.Variants,
            });
        });
        return formatedProducts;
    };

    useEffect(() => {
        getProducts().then((res) => {
            const formatedProducts = prepareProducts(res.data);
            setProducts(formatedProducts);
        });
    }, []);

    const [variant, setVariant] = useState('black blue');
    const [quantity, setQuantity] = useState(0);
    const [date, setDate] = useState(today());
    const [price, setPrice] = useState(0);

    const [priceTotal, setPriceTotal] = useState(0);

    const [piecePrice, setPiecePrice] = useState(0);

    const [toSubmit, setToSubmit] = useState([]);

    //calculate piece price when price and quantity change
    useEffect(() => {
        if (price !== 0 && quantity !== 0 && price != '' && quantity != '') {
            setPiecePrice(price / quantity);
        }
    }, [price, quantity]);

    //calculate price when piece price changes
    useEffect(() => {
        if (piecePrice != 0 && quantity != 0 && piecePrice != '' && quantity != '') {
            setPrice(piecePrice * quantity);
        }
    }, [piecePrice]);

    const mapItems = async (id) => {
        return Promise.all(
            toSubmit.map((item) => {
                addWarehouse(
                    id,
                    item.ProductName,
                    item.ProductVariant,
                    item.Quantity,
                    item.PriceBought,
                    item.DateBought,
                    item.UnitPrice
                );
            })
        );
    };

    //onSubmit gets the data from onAdd. If it's not empty, it gets submitted by axios
    const onSubmit = () => {
        if (toSubmit.length > 0) {
            addCollection(priceTotal, date).then((res) => {
                mapItems(res.data.collection.ID)
                    .then(() => {
                        props.forceUpdate();
                        createNotification({
                            title: 'Dodano pomyślnie',
                            message: 'zapis powiódł się',
                            type: 'success',
                        });
                    })
                    .then(setToSubmit([]));
            });
        } else {
            createNotification({
                title: 'Nie ma nic do dodania',
                message: 'Naciśnij +, aby dodać element',
                type: 'danger',
            });
        }
    };

    //handles the + button, pushes the product into toSubmit array
    const onAdd = () => {
        if (quantity == 0 || price == 0) {
            createNotification({
                title: 'Uzupełnij puste pola',
                message: 'upewnij się, że cena oraz ilość nie są puste',
                type: 'danger',
            });
        } else {
            const elements = {
                Id: toSubmit.length,
                ProductName: name,
                ProductVariant: variant,
                Quantity: quantity,
                PriceBought: price,
                DateBought: date,
                UnitPrice: price / quantity,
            };
            setToSubmit([...toSubmit, elements]);
            setPriceTotal(parseInt(priceTotal) + parseInt(price));
        }
    };

    //handles the price for one piece field
    var quant = '';

    if (price / quantity < 10000) {
        quant = price / quantity;
    } else {
        quant = 0;
    }

    //deletes the element when you click X
    const handleDelete = (element) => {
        const toDelete = parseInt(element.getAttribute('arraykey'));
        setToSubmit(toSubmit.filter((item) => item.Id !== toDelete));
        const productToDelete = toSubmit.filter((item) => item.Id === toDelete);
        setPriceTotal(parseInt(priceTotal) - parseInt(productToDelete[0].PriceBought));
    };

    const inputTheme = {
        text: 'white',
        primary25: 'var(--input)',
        primary: 'var(--accent)',
        neutral0: 'var(--base)',
        neutral20: 'var(--input)',
        neutral80: 'var(--accent-font)',
    };

    return (
        <div className="add-warehouse-container inner-container">
            <h3>Dodaj do magazynu</h3>
            <div className="add-warehouse-inner">
                <div className="add-sale-inputs">
                    <div className="add-sale-inputs-inner">
                        <Autocomplete
                            disablePortal
                            options={products}
                            onChange={(event, newValue) => {
                                onChangeName(newValue);
                            }}
                            size="small"
                            renderInput={(params) => <TextField {...params} label="produkt" />}
                        />
                        <Autocomplete
                            disablePortal
                            options={variants}
                            onChange={(event, newValue) => {
                                onChangeVariant(newValue);
                            }}
                            size="small"
                            renderInput={(params) => <TextField {...params} label="wariant" />}
                        />
                        <TextField
                            label="ilość"
                            variant="outlined"
                            size="small"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </div>
                    <div className="add-sale-inputs-inner">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="data"
                                value={date}
                                onChange={(newValue) => {
                                    setDate(convertFullDateToSqlFormat(newValue));
                                }}
                                renderInput={(params) => <TextField {...params} size="small" />}
                            />
                        </LocalizationProvider>
                        <TextField
                            label="cena"
                            variant="outlined"
                            size="small"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        <div>
                            <div>
                                <TextField
                                    label="cena za szt"
                                    variant="outlined"
                                    size="small"
                                    type="number"
                                    value={piecePrice}
                                    onChange={(e) => setPiecePrice(e.target.value)}
                                    style={{ maxWidth: 120, marginRight: 8 }}
                                />
                                <Tooltip title="dodaj do listy" placement="right">
                                    <Button
                                        disableElevation
                                        variant="contained"
                                        onClick={onAdd}
                                        style={{
                                            maxWidth: 10,
                                            minWidth: 10,
                                        }}
                                    >
                                        +
                                    </Button>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                    <button className="add-sale-button button-primary" onClick={onSubmit}>
                        dodaj
                    </button>
                </div>
                <div className="add-warehouse-temp-list">
                    <table>
                        <tbody>
                            <tr>
                                <th>nazwa</th>
                                <th>wariant</th>
                                <th>ilość</th>
                                <th>wartość</th>
                                <th>akcje</th>
                            </tr>
                            {toSubmit.map((item) => (
                                <tr key={item.Id}>
                                    <td>{item.ProductName}</td>
                                    <td>{item.ProductVariant}</td>
                                    <td>{item.Quantity}</td>
                                    <td>{item.PriceBought}</td>
                                    <td>
                                        <Tooltip title="usuń" placement="right" arraykey={item.Id}>
                                            <IconButton onClick={(e) => handleDelete(e.target)}>x</IconButton>
                                        </Tooltip>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AddWarehouse;
