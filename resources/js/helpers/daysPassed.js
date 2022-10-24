///calculates how many days have passed between two dates
const daysPassed = (date1, date2) => {
    const dateCalc1 = new Date(date1);
    const dateCalc2 = new Date(date2);

    const timeDiff = dateCalc2.getTime() - dateCalc1.getTime();
    const dayDiff = timeDiff / (1000 * 3600 * 24);

    return Math.round(dayDiff);
  }

  export default daysPassed;