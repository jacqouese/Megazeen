const { split } = require("lodash");

//converts yyyy-mm-dd to mm/dd/yyyy
function convertDate(date) {
    const splitDate = date.split('-');

    const year = splitDate[0];
    const month = splitDate[1];
    const day = splitDate[2];

    return month+'/'+day+'/'+year;
}

export default convertDate;