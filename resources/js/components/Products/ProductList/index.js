import { useEffect, useReducer, useState } from 'react';
import { addVariant, deleteProduct, deleteVariant, getProducts } from '../../../api/api';
import Loading from '../../_shared/Loading';
import searchImg from '../../../assets/search.png';
import ActionMenu from '../../_shared/ActionMenu';
import { createNotification } from '../../../services/notification';
import { Button } from '@mui/material';
import AddProduct from './AddProduct';
import baseURL from '../../../api/baseURL';
import { LazyLoadImage } from 'react-lazy-load-image-component';

function ProductList() {
    const [update, forceUpdate] = useReducer((x) => x + 1, 0);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openAddProduct, setOpenAddProduct] = useState(false);
    const [isVariant, setIsVariant] = useState(false);
    const [variantId, setVariantId] = useState(null);

    useEffect(() => {
        getProducts().then((res) => {
            setProducts(res.data);
            setLoading(false);
        });
    }, [update]);

    const handleRemoveVariant = (id) => {
        deleteVariant(id)
            .then((res) => {
                forceUpdate();
                if (res.status === 200) {
                    createNotification({
                        title: 'Udało się',
                        message: `Wariant został usunięty`,
                        type: 'success',
                    });
                }
            })
            .catch(() => {
                createNotification({
                    title: 'Coś poszło nie tak',
                    message: `Spróbój jeszcze raz`,
                    type: 'danger',
                });
            });
    };

    const handleRemoveProduct = (id) => {
        deleteProduct(id)
            .then((res) => {
                forceUpdate();
                if (res.status === 200) {
                    createNotification({
                        title: 'Udało się',
                        message: `Produkt został usunięty`,
                        type: 'success',
                    });
                }
            })
            .catch((err) => {
                createNotification({
                    title: 'Coś poszło nie tak',
                    message: `Spróbój jeszcze raz`,
                    type: 'danger',
                });
            });
    };

    const handleAddProduct = () => {
        setIsVariant(false);
        setOpenAddProduct(true);
    };

    const handleAddVariant = (id) => {
        setVariantId(id);
        setIsVariant(true);
        setOpenAddProduct(true);
    };

    const data = (
        <>
            <div className="sale-list-info">
                <hr />
                <div>
                    <p style={{ marginLeft: 20, width: '70%' }}>Informacje</p>
                    <p style={{ width: '5%' }}>Akcje</p>
                </div>
                <hr />
            </div>
            {products.length ? (
                <>
                    {products
                        .slice(0)
                        .reverse()
                        .map((productInstance) => (
                            <div className="single-collection" key={productInstance.ID}>
                                <div className="collection-top">
                                    <div className="collection-top-inner">
                                        <p>{productInstance.ProductName}</p>
                                        <p>{productInstance.ID}</p>
                                    </div>
                                    <div className="collection-top-inner">
                                        <ActionMenu
                                            menuActions={[
                                                {
                                                    name: 'usuń cały produkt',
                                                    action: () => handleRemoveProduct(productInstance.ID),
                                                },
                                            ]}
                                        />
                                    </div>
                                    <hr />
                                </div>
                                <div className="collection-bottom">
                                    <div className="collection-products product-list-products">
                                        {productInstance.Variants.map((variant, index) => {
                                            return (
                                                <div className="collection-product product-list-variant" key={index}>
                                                    <div className="collection-product-image">
                                                        <LazyLoadImage
                                                            alt=""
                                                            threshold={10}
                                                            effect="blur"
                                                            src={`${baseURL}/api/variants/image/${productInstance.ProductName}/${variant.VariantName}`}
                                                        />
                                                    </div>
                                                    <div>
                                                        <h5>{variant.VariantName}</h5>
                                                    </div>
                                                    <div>
                                                        <ActionMenu
                                                            menuActions={[
                                                                {
                                                                    name: 'usuń',
                                                                    action: () => handleRemoveVariant(variant.ID),
                                                                },
                                                            ]}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div className="collection-product product-list-variant">
                                            <Button
                                                variant="text"
                                                style={{ width: 200 }}
                                                onClick={() => {
                                                    handleAddVariant(productInstance.ID);
                                                }}
                                            >
                                                Dodaj wariant
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="collection-note">
                                        <h5></h5>
                                    </div>
                                </div>
                            </div>
                        ))}
                </>
            ) : null}
            <Button variant="text" style={{ width: '100%', height: 50 }} onClick={handleAddProduct}>
                Dodaj nowy produkt
            </Button>
        </>
    );

    return (
        <div className="sale-list-container inner-container warehouse-collections">
            <AddProduct
                open={openAddProduct}
                setOpen={setOpenAddProduct}
                forceUpdate={forceUpdate}
                isVariant={isVariant}
                variantId={variantId}
            />
            {data}
            {loading ? (
                <Loading />
            ) : products ? null : (
                <div className="no-results-container">
                    <img src={searchImg} alt="" />
                    <h2>Brak produktów</h2>
                    <p>Dodaj swój pierwszy produkt</p>
                </div>
            )}
        </div>
    );
}

export default ProductList;
