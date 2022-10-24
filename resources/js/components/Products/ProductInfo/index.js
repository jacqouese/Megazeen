import productsImg from '../../../assets/productsImage.svg';

function ProductInfo() {
    return (
        <div className="add-warehouse-container inner-container inner-info-container">
            <div>
                <h3>Tutaj widoczne są twoje produkty</h3>
                <br />
                <p>Dodaj produkt aby mieć mozliwość sprzedazy w zakładce Moja sprzedaż.</p>
            </div>
            <img src={productsImg} alt="" style={{ width: 200 }} />
        </div>
    );
}

export default ProductInfo;
