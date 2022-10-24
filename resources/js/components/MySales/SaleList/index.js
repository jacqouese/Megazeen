import React, { useEffect, useRef, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { TextField } from '@mui/material';

import ActionMenu from '../../_shared/ActionMenu';
import Loading from '../../_shared/Loading';
import searchImg from '../../../assets/search.png';
import invoiceIcon from '../../../assets/invoice-icon.svg';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { addReturn, cancelSale, deleteSale, getSales, searchSales } from '../../../api/api';
import today from '../../../helpers/today';
import displayDaysPassed from '../../../helpers/displayDaysPassed';
import { createErrorNotification, createNotification } from '../../../services/notification';
import dialog from '../../../services/dialog';
import baseURL from '../../../api/baseURL';

function SaleList({ update, forceUpdate, setOpenEditSale, setOpenReturnSale, setCurrentId }) {
    const [allSold, setAllSold] = useState([]);
    const [pages, setPages] = useState([]);
    const [currPage, setCurrPage] = useState(1);
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

    const handlePageClick = ({ selected: selectedPage }) => {
        setCurrPage(selectedPage + 1);
    };

    const handleDelete = (id) => {
        dialog.show({
            title: 'Czy napewno chcesz usunąć sprzedaz',
            content: 'Ta akcja jest nieodwracalna',
            onConfirm: () => {
                deleteSale(id)
                    .then((res) => {
                        if (res.status === 200) {
                            createNotification({
                                title: 'Udało się',
                                message: `Sprzedaż została trwale usunięta`,
                                type: 'success',
                            });
                        }
                        forceUpdate();
                    })
                    .catch(() => {
                        createNotification({
                            title: 'Operacja nie powiodła się',
                            message: `Żadne zmiany nie zostały wprowadzone`,
                            type: 'error',
                        });
                    });
            },
        });
    };

    const handleCancel = (id) => {
        dialog.show({
            title: 'Czy napewno chcesz cofnąć sprzedaz do magazynu',
            content: 'Sprzedaz zostanie usunięta z listy oraz dodana ponownie do magazynu',
            onConfirm: () => {
                cancelSale(id)
                    .then((res) => {
                        forceUpdate();
                        if (res.status === 200) {
                            createNotification({
                                title: 'Sprzedaż została cofnięta do magazynu',
                                message: `Kolekcja magazynu zawiera ${res.data.quantity + 1} sztuk`,
                                type: 'success',
                            });
                        }
                    })
                    .catch((err) => {
                        createErrorNotification({
                            statusCode: err.response.status,
                        });
                    });
            },
        });
    };

    const handleEdit = (id) => {
        setCurrentId(id);
        setOpenEditSale(true);
    };

    const handleReturn = (id) => {
        setCurrentId(id);
        setOpenReturnSale(true);
    };

    // handle searchbar
    const didMountSearch = useRef(false);
    useEffect(() => {
        if (didMountSearch.current) {
            const timeoutId = setTimeout(() => {
                if (searchQuery.length > 2) {
                    setLoading(true);
                    searchSales(searchQuery).then((res) => {
                        setAllSold(res.data.data);
                        setLoading(false);
                    });
                } else if (searchQuery.length == 0) {
                    setLoading(true);
                    getSales(currPage)
                        .then((res) => {
                            setAllSold(res.data.data);
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
        getSales(currPage)
            .then((res) => {
                setAllSold(res.data.data);
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
                    <p style={{ marginLeft: 55, width: 95 }}>Nazwa</p>
                    <p style={{ width: 115 }}>Kupujący</p>
                    <p style={{ width: 90 }}>Cena</p>
                    <p style={{ width: 90 }}>Data</p>
                    <p style={{ width: 60 }}>Zarobek</p>
                    <p style={{ width: 40 }}>Opcje</p>
                </div>
                <hr />
            </div>
            {allSold.length ? (
                <>
                    {allSold.map((product) => (
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
                            <div style={{ width: 90 }}>
                                <h5>{product.PriceSold}</h5>
                                <p className="light">{product.Shipping}</p>
                            </div>
                            <div style={{ width: 90 }}>
                                <h5>{displayDaysPassed(product.DateSold, today())}</h5>
                                <p className="light">{product.DateSold}</p>
                            </div>
                            <div style={{ width: 60 }}>
                                <p>
                                    <span className="bold">{product.Profit}</span> zł
                                </p>
                            </div>
                            <div style={{ width: 40 }}>
                                <ActionMenu
                                    menuActions={[
                                        {
                                            name: 'edytuj',
                                            action: () => handleEdit(product.ID),
                                        },
                                        {
                                            name: 'dodaj do zwrotów',
                                            action: () => handleReturn(product.ID),
                                        },
                                        {
                                            name: 'cofnij sprzedaż',
                                            action: () => handleCancel(product.ID),
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
            ) : allSold.length ? null : (
                <div className="no-results-container">
                    <img src={searchImg} alt="" />
                    <h2>Brak produktów</h2>
                    <p>Wyczyść filtry lub dodaj sprzedaż</p>
                </div>
            )}
        </div>
    );
}

export default SaleList;
