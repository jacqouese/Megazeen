import jsPDF from 'jspdf';
import 'jspdf-autotable';
import months from '../data/months';

export function generateMonthlyPDF(year, month, data, name) {
    const numOfDays = 30;
    const daily = new Array(numOfDays);

    for (let i = 0; i < numOfDays + 1; i++) {
        daily[i] = [i + 1, 0, 0, 0];
    }

    const formatedData = [];
    var totalSum = 0;
    var totalWithoutVat = 0;
    var totalVat = 0;

    // iterate over each sale and format it for the PDF
    data.forEach((item, index) => {
        // parsing values
        const price = parseFloat(item.PriceSold);
        const shipping = parseFloat(item.Shipping);

        // calculate needed values
        const beforeVat = parseFloat(((price + shipping) / 1.23).toFixed(2));
        const vatValue = parseFloat((price + shipping - beforeVat).toFixed(2));

        // sum
        totalSum = totalSum + price + shipping;
        totalWithoutVat += beforeVat;
        totalVat += vatValue;

        var buyer = item.Buyer;
        if (item.returned_at != null) {
            buyer = buyer + ' [z]';
        }

        // store values in formatedData array
        formatedData[index] = [
            item.DateSold,
            buyer,
            price,
            shipping,
            price + shipping,
            beforeVat,
            vatValue,
        ];

        var day = item.DateSold;
        day = day.split('-');
        day = parseInt(day[2]);

        var dailyTotal = parseFloat(daily[day - 1][1]) + (price + shipping);
        var dailyBeforeVat =
            parseFloat(daily[day - 1][2]) + parseFloat(beforeVat);
        var dailyVatValue =
            parseFloat(daily[day - 1][3]) + parseFloat(vatValue);

        daily[day - 1][1] = parseFloat(dailyTotal).toFixed(2);
        daily[day - 1][2] = parseFloat(dailyBeforeVat).toFixed(2);
        daily[day - 1][3] = parseFloat(dailyVatValue).toFixed(2);
    });

    daily[numOfDays + 1] = [
        'suma:',
        totalSum.toFixed(2),
        totalWithoutVat.toFixed(2),
        totalVat.toFixed(2),
    ];

    const pdf = new jsPDF();

    pdf.text(20, 15, 'Sprzedaz bezrachunkowa - ' + name);
    pdf.text(20, 22, months[month + 1] + ' ' + year);
    pdf.autoTable({
        margin: { top: 25 },
        head: [
            ['Data', 'Kupujacy', 'Cena', 'Wysylka', 'Razem', 'Bez VAT', 'VAT'],
        ],
        body: formatedData,
    });
    pdf.autoTable({
        tableWidth: 100,
        head: [['Dzien', 'Suma', 'Bez VAT', 'VAT']],
        body: daily,
    });

    pdf.save(months[month + 1] + '_' + year + '.pdf');
}
