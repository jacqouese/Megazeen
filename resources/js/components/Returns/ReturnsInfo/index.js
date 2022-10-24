import React from 'react';
import returnImg from '../../../assets/returns.svg';

function ReturnsInfo() {
    return (
        <div className="add-warehouse-container inner-container inner-info-container">
            <div>
                <h3>Tutaj widoczne są twoje zwroty</h3>
                <br />
                <p>Zwroty możesz dodać w zakładce Moja sprzedaż poprzez wybór odpowiedniej opcji z menu.</p>
            </div>
            <img src={returnImg} alt="" style={{ width: 200 }} />
        </div>
    );
}

export default ReturnsInfo;
