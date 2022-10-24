import { TextField } from '@mui/material';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import ActionMenu from '../components/_shared/ActionMenu';
import Loading from '../components/_shared/Loading';
import ReturnsInfo from '../components/Returns/ReturnsInfo';
import searchImg from '../assets/search.png';
import invoiceIcon from '../assets/invoice-icon.svg';

import { cancelSale, deleteSale, getReturns, returnToSold, serachReturns } from '../api/api';
import today from '../helpers/today';
import { createNotification } from '../services/notification';
import displayDaysPassed from '../helpers/displayDaysPassed';
import baseURL from '../api/baseURL';

function Returns() {
    const [update, forceUpdate] = useReducer((x) => x + 1, 0);
    const [allReturns, setAllReturns] = useState([]);
    const [pages, setPages] = useState([]);
    const [currPage, setCurrPage] = useState(1);
    const handlePageClick = ({ selected: selectedPage }) => {
        setCurrPage(selectedPage + 1);
    };

    const [searchQuery, setSearchQuery] = useState('');

    const [loading, setLoading] = useState(true);

    // display invoice indicator
    const invoiceDiv = (invoice) => {
        if (invoice === 1) {
            return (
                <div style={{ paddingRight: 5 }}>
                    <img src={invoiceIcon} alt="" style={{ width: 15, transform: 'translateY(3px)' }} />
                </div>
            );
        }

        return <div style={{ width: 20 }} />;
    };

    const handleDelete = (id) => {
        deleteSale(id)
            .then((res) => {
                forceUpdate();
                console.log(res);
                if (res.status === 200) {
                    createNotification({
                        title: 'Udało się',
                        message: `Zwrot został permanentnie usunięty`,
                        type: 'success',
                    });
                }
            })
            .catch(() => {
                createNotification({
                    title: 'Operacja nie powiodła się',
                    message: `Żadne zmiany nie zostały wprowadzone`,
                    type: 'error',
                });
            });
    };

    const handleEdit = () => {
        console.log('edit');
    };

    const handleReturnToWarehouse = (id) => {
        cancelSale(id)
            .then((res) => {
                forceUpdate();
                if (res.status === 200) {
                    createNotification({
                        title: 'Udało się',
                        message: `Zwrot został cofnięty do magazynu`,
                        type: 'success',
                    });
                }
            })
            .catch((err) => {
                createNotification({
                    title: 'Operacja nie powiodła się',
                    message: `Żadne zmiany nie zostały wprowadzone`,
                    type: 'error',
                });
            });
    };

    const handleReturnToSold = (id) => {
        returnToSold(id)
            .then((res) => {
                forceUpdate();
                console.log(res);
                if (res.status === 200) {
                    createNotification({
                        title: 'Udało się',
                        message: `Zwrot został cofnięty do sprzedanych`,
                        type: 'success',
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // handle searchbar
    const didMountSearch = useRef(false);
    useEffect(() => {
        if (didMountSearch.current) {
            const timeoutId = setTimeout(() => {
                if (searchQuery.length > 2) {
                    setLoading(true);
                    serachReturns(searchQuery).then((res) => {
                        setAllReturns(res.data.data);
                        setLoading(false);
                    });
                } else if (searchQuery.length == 0) {
                    setLoading(true);
                    getReturns(currPage)
                        .then((res) => {
                            setAllReturns(res.data.data);
                            setPages([res.data.current_page, res.data.last_page, res.data.total]);
                            setLoading(false);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            }, 700);
            return () => clearTimeout(timeoutId);
        } else {
            didMountSearch.current = true;
        }
    }, [searchQuery]);

    // handle pagination
    useEffect(() => {
        getReturns(currPage)
            .then((res) => {
                setAllReturns(res.data.data);
                setPages([res.data.current_page, res.data.last_page, res.data.total]);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [update, currPage]);

    const data = (
        <div>
            <div className="sale-list-info">
                <hr />
                <div>
                    <p style={{ marginLeft: 55, width: 90 }}>Nazwa</p>
                    <p style={{ width: 115 }}>Kupujący</p>
                    <p style={{ width: 50 }}>Cena</p>
                    <p style={{ width: 110 }}>Data sprzedaży</p>
                    <p style={{ width: 90 }}>Data zwrotu</p>
                    <p style={{ width: 40 }}>Opcje</p>
                </div>
                <hr />
            </div>
            {allReturns.length ? (
                <>
                    {allReturns.map((product) => (
                        <div className="sale-list-element" key={product.ID}>
                            <div className="sale-list-element-group">
                                <div className="sale-list-element-image">
                                    <LazyLoadImage
                                        alt=""
                                        threshold={10}
                                        effect="blur"
                                        src={`${baseURL}/api/variants/image/${product.ProductName}/${product.ProductVariant}`}
                                    />
                                </div>
                                <div style={{ width: 70 }}>
                                    <h5>{product.ProductName}</h5>
                                    <p className="light">{product.ProductVariant}</p>
                                </div>
                            </div>
                            <div style={{ width: 140 }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 5,
                                    }}
                                >
                                    {invoiceDiv(product.Invoice)} <p>{product.Buyer}</p>
                                </div>
                            </div>
                            <div style={{ width: 50 }}>
                                <h5>{product.PriceSold}</h5>
                                <p className="light">{product.Shipping}</p>
                            </div>
                            <div style={{ width: 110 }}>
                                <h5>{displayDaysPassed(product.DateSold, today())}</h5>
                                <p className="light">{product.DateSold}</p>
                            </div>
                            <div style={{ width: 90 }}>
                                <h5>{displayDaysPassed(product.returned_at.split(' ')[0], today())}</h5>
                                <p className="light">{product.returned_at.split(' ')[0]}</p>
                            </div>
                            <div style={{ width: 40 }}>
                                <ActionMenu
                                    menuActions={[
                                        {
                                            name: 'cofnij zwrot do sprzedanych',
                                            action: () => handleReturnToSold(product.ID),
                                        },
                                        {
                                            name: 'zwróć zwrot do magazynu',
                                            action: () => handleReturnToWarehouse(product.ID),
                                        },
                                        {
                                            name: 'usuń',
                                            action: () => handleDelete(product.ID),
                                        },
                                    ]}
                                />
                            </div>
                            <hr />
                        </div>
                    ))}
                    <div className="pagination-container">
                        {pages[2] > 0 ? (
                            <ReactPaginate
                                previousLabel={'← Wstecz'}
                                nextLabel={'Dalej →'}
                                pageCount={pages[1]}
                                onPageChange={handlePageClick}
                                containerClassName={'pagination'}
                                previousLinkClassName={'pagination__link'}
                                nextLinkClassName={'pagination__link'}
                                disabledClassName={'pagination__link--disabled'}
                                activeClassName={'pagination__link--active'}
                            />
                        ) : null}
                    </div>
                </>
            ) : null}
        </div>
    );
    return (
        <div className="my-sales">
            <div className="my-sales-inner">
                <ReturnsInfo />
                <div className="sale-list-container inner-container">
                    <div style={{ maxWidth: 500 }}>
                        <TextField
                            fullWidth
                            label="szukaj"
                            type="search"
                            size="small"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ marginBottom: 10 }}
                        />
                    </div>
                    {data}
                    {loading ? (
                        <Loading />
                    ) : allReturns.length ? null : (
                        <div className="no-results-container">
                            <img src={searchImg} alt="" />
                            <h2>Brak zwrotów</h2>
                            <p>Zwrot możesz dodać w zakładce Moja sprzedaż</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Returns;
