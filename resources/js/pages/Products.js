import ProductInfo from '../components/Products/ProductInfo';
import ProductList from '../components/Products/ProductList';

function Products() {
    return (
        <div className="my-sales">
            <div className="my-sales-inner">
                <ProductInfo />
                <ProductList />
            </div>
        </div>
    );
}

export default Products;
