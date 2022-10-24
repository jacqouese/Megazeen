import React, { useState, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { getProductsWithQuantity } from '../../../api/api';
import baseURL from '../../../api/baseURL';
import searchImg from '../../../assets/search.png';
import Loading from '../../_shared/Loading';

function ProductStock() {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProductsWithQuantity().then((res) => {
            const formatedData = [];
            res.data.forEach((elem) => {
                const foundElem = formatedData.find((o) => o.ProductName === elem.ProductName);
                if (!foundElem) {
                    return formatedData.push({
                        ProductName: elem.ProductName,
                        TotalQuantity: parseInt(elem.TotalQuantity),
                        ProductVariants: [
                            {
                                VariantName: elem.ProductVariant,
                                VariantQuantity: parseInt(elem.TotalQuantity),
                            },
                        ],
                    });
                }
                foundElem.TotalQuantity = foundElem.TotalQuantity + parseInt(elem.TotalQuantity);
                foundElem.ProductVariants.push({
                    VariantName: elem.ProductVariant,
                    VariantQuantity: parseInt(elem.TotalQuantity),
                });
            });
            setProducts(formatedData);
            setLoading(false);
        });
    }, []);

    const renderData = () => {
        return (
            <>
                <div className="sale-list-info">
                    <hr />
                    <div>
                        <p style={{ marginLeft: 20, width: '55%' }}>Informacje</p>
                        <p style={{ width: '17%' }}>Razem sztuk</p>
                    </div>
                    <hr />
                </div>
                <br />
                <div className="warehouse-collections">
                    {products.map((product) => {
                        return (
                            <div className="single-collection" key={product.ProductName}>
                                <div className="collection-top">
                                    <div className="collection-top-inner">
                                        <h5>{product.ProductName}</h5>
                                    </div>
                                    <hr />
                                </div>
                                <div className="collection-bottom">
                                    <div className="collection-products stats-products">
                                        {product.ProductVariants.map((variant, idx) => {
                                            return (
                                                <div className="collection-product stats-product" key={idx}>
                                                    <div className="collection-product-image">
                                                        <LazyLoadImage
                                                            alt=""
                                                            threshold={10}
                                                            effect="blur"
                                                            src={`${baseURL}/api/variants/image/${product.ProductName}/${variant.VariantName}`}
                                                        />
                                                    </div>
                                                    <div>
                                                        <h5>{variant.VariantName}</h5>
                                                        <p className="light">{variant.VariantQuantity} szt</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="collection-total">
                                        <h5>{product.TotalQuantity} szt</h5>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </>
        );
    };

    return (
        <div className="product-stats-container inner-container">
            <h3 className="title">Stan produktów</h3>
            <br />
            {loading ? (
                <Loading />
            ) : products.length ? (
                renderData()
            ) : (
                <div className="no-results-container">
                    <img src={searchImg} alt="" />
                    <h2>Brak produktów</h2>
                    <p>Dodaj swój pierwszy produkt w zakładce Produkty</p>
                </div>
            )}
        </div>
    );
}

export default ProductStock;
