import React, { useState } from 'react';
import { getSalesByDate, getUserDetailsGeneral } from '../../../api/api';
import Calendar from './Calendar';
import { generateMonthlyPDF } from '../../../services/pdf';

function NewStatement() {
    // todays date
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();

    // date given by user
    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(currentMonth);

    const handleClick = () => {
        getSalesByDate(
            `${year}-${month + 1}-01_${year}-${month + 1}-31`,
            0
        ).then((res) => {
            const pdfData = res.data;
            getUserDetailsGeneral().then((res) => {
                generateMonthlyPDF(year, month, pdfData, res.data.name);
            });
        });
    };

    return (
        <div className="new-statement-container inner-container">
            <h3 className="title">Utwórz zestawienie</h3>
            <Calendar
                setYear={setYear}
                setMonth={setMonth}
                year={year}
                month={month}
            />
            <button
                className="button-primary add-sale-button"
                onClick={handleClick}
            >
                pobierz
            </button>
        </div>
    );
}

export default NewStatement;
