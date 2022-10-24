import Axios from 'axios';
import { useEffect, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { deleteCollection, getWarehouseWithProducts } from '../../../api/api';
import Loading from '../../_shared/Loading';
import searchImg from '../../../assets/search.png';
import { createNotification } from '../../../services/notification';
import ActionMenu from '../../_shared/ActionMenu';
import dialog from '../../../services/dialog';
import baseURL from '../../../api/baseURL';

function WarehouseList(props) {
    const [allWarehouse, setAllWarehouse] = useState([]);

    const [loading, setLoading] = useState(true);

    const handleDelete = (id) => {
        dialog.show({
            title: 'Czy na pewno chcesz usunąć kolekcje magazynu?',
            content:
                'Cała kolekcja wraz przypisanym do niej towarem zostanie trwale usunięta. Jeśli sprzedałeś juz przedmioty z tej kolekcji, późniejsze cofnięcie do magazynu nie będzie mozliwe',
            onConfirm: () => {
                deleteCollection(id)
                    .then((res) => {
                        console.log(res);
                        props.forceUpdate();
                        if (res.status === 200) {
                            createNotification({
                                title: 'Udało się',
                                message: `Kolekcja magazynu została trwale usunięta`,
                                type: 'success',
                            });
                        }
                    })
                    .catch((err) => {
                        createNotification({
                            title: 'Coś poszło nie tak',
                            message: `Zadne zmiany nie zaszły`,
                            type: 'success',
                        });
                    });
            },
        });
    };

    const handleCancel = (id) => {};

    const handleEdit = () => {
        console.log('edit');
    };

    useEffect(() => {
        getWarehouseWithProducts().then((res) => {
            setAllWarehouse(res.data);
            setLoading(false);
        });
    }, [props.update]);

    const data = (
        <>
            <div className="sale-list-info">
                <hr />
                <div>
                    <p style={{ marginLeft: 20, width: '55%' }}>Informacje</p>
                    <p style={{ width: '15%' }}>Wartość całkowita</p>
                    <p style={{ width: '7%' }}>Notatki</p>
                    <p style={{ width: '5%' }}>Akcje</p>
                </div>
                <hr />
            </div>
            {allWarehouse.length ? (
                <>
                    {allWarehouse
                        .slice(0)
                        .reverse()
                        .map((collection) => (
                            <div className="single-collection" key={collection.ID}>
                                <div className="collection-top">
                                    <div className="collection-top-inner">
                                        <p>{collection.DateBought}</p>
                                        <p>{collection.ID}</p>
                                    </div>
                                    <div className="collection-top-inner">
                                        <ActionMenu
                                            menuActions={[
                                                {
                                                    name: 'edytuj',
                                                    action: () => handleEdit(),
                                                },
                                                {
                                                    name: 'usuń',
                                                    action: () => handleDelete(collection.ID),
                                                },
                                            ]}
                                        />
                                    </div>
                                    <hr />
                                </div>
                                <div className="collection-bottom">
                                    <div className="collection-products">
                                        {collection.Products.map((product, index) => {
                                            return (
                                                <div className="collection-product" key={index}>
                                                    <div className="collection-product-image">
                                                        <LazyLoadImage
                                                            alt=""
                                                            threshold={10}
                                                            effect="blur"
                                                            src={`${baseURL}/api/variants/image/${product.ProductName}/${product.ProductVariant}`}
                                                        />
                                                    </div>
                                                    <div>
                                                        <h5>{product.ProductName}</h5>
                                                        <p className="light">{product.ProductVariant}</p>
                                                    </div>
                                                    <div>
                                                        <h5>{product.OriginalQuantity} szt</h5>
                                                        <p className="light">pozostało {product.Quantity}</p>
                                                    </div>
                                                    <div>
                                                        <h5>{product.UnitPrice} zł</h5>
                                                        <p className="light">{product.PriceBought} zł</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="collection-total">
                                        <h5>{collection.PriceTotal} zł</h5>
                                    </div>
                                    <div className="collection-note">
                                        <h5></h5>
                                    </div>
                                </div>
                            </div>
                        ))}
                </>
            ) : null}
        </>
    );
    return (
        <div className="sale-list-container inner-container warehouse-collections">
            {data}
            {loading ? (
                <Loading />
            ) : allWarehouse.length ? null : (
                <div className="no-results-container">
                    <img src={searchImg} alt="" />
                    <h2>Brak kolekcji magazynu</h2>
                    <p>Wyczyść filtry lub dodaj nową kolekcję</p>
                </div>
            )}
        </div>
    );
}

export default WarehouseList;
