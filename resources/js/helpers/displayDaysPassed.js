import daysPassed from './daysPassed';

function displayDaysPassed(date1, date2) {
    const days = daysPassed(date1, date2);

    if (days > 1) {
        return days + ' dni temu';
    } else if (days == 1) {
        return 'wczoraj';
    } else {
        return 'dzisiaj';
    }
}

export default displayDaysPassed;
