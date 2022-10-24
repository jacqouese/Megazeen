import React, { useEffect, useState } from 'react';
import { Autocomplete, createFilterOptions, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import check from '../../../assets/check.svg';

import { getLastItemByNameVariant, getProducts, getShippingOptions, postSale } from '../../../api/api';
import { createNotification, createErrorNotification } from '../../../services/notification';
import today from '../../../helpers/today';
import convertFullDateToSqlFormat from '../../../helpers/convertFullDateToSqlFormat';

function AddSale(props) {
    const [variants, setVariants] = useState([]);
    const [subVariants, setSubVariants] = useState([]);

    const [name, setName] = useState('');
    const onChangeName = (item) => {
        if (item === null) {
            setName('');
            setSubVariants([]);
            return;
        }

        // after user chooses item in select
        setName(item.value);
        // load the right variant for product

        const formatedVariants = item.variants.map((variant) => {
            return { label: variant.VariantName, value: variant.VariantName };
        });

        setSubVariants(formatedVariants);
    };
    const [price, setPrice] = useState('');
    const [variant, setVariant] = useState('');

    const [invoice, setInvoice] = useState(0);
    const [featured, setFeatured] = useState(0);
    const [sale, setSale] = useState(0);

    const onChangeVariant = (item) => {
        // after user chooses item in select
        setVariant(item.value);
        // load price suggestion

        getLastItemByNameVariant(name, item.value).then((res) => {
            const priceToSet = res.data.PriceSold || 0;
            const featureToSet = res.data.Featured || 0;
            const saleToSet = res.data.Sale || 0;

            setPrice(priceToSet);
            setFeatured(featureToSet);
            setSale(saleToSet);
        });
    };

    const [date, setDate] = useState(today());

    const [shipping, setShipping] = useState(0);
    const onChangeShipping = (item) => {
        // after user chooses item in select
        setShipping(item.value);
    };

    const filter = createFilterOptions();

    const [buyer, setBuyer] = useState('');

    const [shippingOptions, setShippingOptions] = useState([]);

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

    const prepareShippingOptions = (shippingOptions) => {
        const formatedShippingOptions = [];

        shippingOptions.forEach((option) => {
            formatedShippingOptions.push({
                label: option.name,
                value: option.value,
            });
        });
        return formatedShippingOptions;
    };

    useEffect(() => {
        getProducts().then((res) => {
            const formatedProducts = prepareProducts(res.data);
            setVariants(formatedProducts);
        });

        getShippingOptions().then((res) => {
            const foramtedShipping = prepareShippingOptions(res.data);
            setShippingOptions(foramtedShipping);
        });
    }, []);

    const onSubmit = () => {
        // send a request to add the sale
        postSale(name, variant, invoice, price, shipping, buyer, date, featured, sale)
            .then((res) => {
                // reload the list of items
                props.forceUpdate();
                // display a message for the user
                createNotification({
                    title: 'Dodano pomyślnie',
                    message: `Pozostało ${res.data.quantity} szt`,
                    type: res.data.type,
                });
            })
            .catch((err) => {
                createErrorNotification({ statusCode: err.response.status });
            });
    };

    const onCheckboxClick = (e, type) => {
        if (type === 'invoice') {
            setInvoice(!invoice);
        } else if (type === 'featured') {
            setFeatured(!featured);
        } else if (type === 'sale') {
            setSale(!sale);
        }
    };

    useEffect(() => {
        if (invoice == 1) {
            document.querySelector('#invoice').classList.add('active');
        } else {
            document.querySelector('#invoice').classList.remove('active');
        }
    }, [invoice]);

    useEffect(() => {
        if (featured == 1) {
            document.querySelector('#featured').classList.add('active');
        } else {
            document.querySelector('#featured').classList.remove('active');
        }
    }, [featured]);

    useEffect(() => {
        if (sale == 1) {
            document.querySelector('#sale').classList.add('active');
        } else {
            document.querySelector('#sale').classList.remove('active');
        }
    }, [sale]);

    return (
        <div className="add-sale-container inner-container">
            <h3>Moja sprzedaż</h3>
            <div className="add-sale-inputs">
                <div className="add-sale-inputs-inner">
                    <Autocomplete
                        disablePortal
                        options={variants}
                        onChange={(event, newValue) => {
                            onChangeName(newValue);
                        }}
                        size="small"
                        noOptionsText="Nie znaleziono"
                        renderInput={(params) => <TextField {...params} label="produkt" />}
                    />
                    <Autocomplete
                        disablePortal
                        options={subVariants}
                        onChange={(event, newValue) => {
                            onChangeVariant(newValue);
                        }}
                        size="small"
                        noOptionsText="Nie znaleziono"
                        renderInput={(params) => <TextField {...params} label="wariant" />}
                    />

                    <TextField
                        label="kupujący"
                        variant="outlined"
                        size="small"
                        onChange={(e) => setBuyer(e.target.value)}
                    />
                    <TextField label="uwagi" variant="outlined" size="small" />
                    <div className="invoice-checkbox" id="featured" onClick={(e) => onCheckboxClick(e, 'featured')}>
                        <span className="checkbox-span">
                            <img className="check-img" src={check} alt="" />
                        </span>
                        <p>wyróżnienie</p>
                    </div>
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
                    <Autocomplete
                        disablePortal
                        options={shippingOptions}
                        onChange={(event, newValue) => {
                            onChangeShipping(newValue);
                        }}
                        size="small"
                        noOptionsText="Brak wysyłki"
                        renderInput={(params) => <TextField {...params} label="wysyłka" />}
                    />
                    <TextField
                        label="cena"
                        variant="outlined"
                        size="small"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />

                    <div className="invoice-checkbox" id="invoice" onClick={(e) => onCheckboxClick(e, 'invoice')}>
                        <span className="checkbox-span">
                            <img className="check-img" src={check} alt="" />
                        </span>
                        <p>faktura</p>
                    </div>
                    <div className="invoice-checkbox" id="sale" onClick={(e) => onCheckboxClick(e, 'sale')}>
                        <span className="checkbox-span">
                            <img className="check-img" src={check} alt="" />
                        </span>
                        <p>wyprzedaż</p>
                    </div>
                </div>
                <button className="add-sale-button button-primary" type="button" onClick={onSubmit}>
                    dodaj
                </button>
            </div>
        </div>
    );
}

export default AddSale;
