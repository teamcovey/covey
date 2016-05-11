angular.module('date.services', [])

.factory('dateFactory', () => {
  return ({
    convertToTextDate: (dateString) => {
      const daysOfWeek = {
        0: 'Sun',
        1: 'Mon',
        2: 'Tue',
        3: 'Wed',
        4: 'Thur',
        5: 'Fri',
        6: 'Sat',
      };
      const dateSuffixes = {
        1: 'st',
        21: 'st',
        31: 'st',
        2: 'nd',
        22: 'nd',
        3: 'rd',
        23: 'rd',
      };
      const months = {
        0: 'Jan',
        1: 'Feb',
        2: 'Mar',
        3: 'Apr',
        4: 'May',
        5: 'Jun',
        6: 'Jul',
        7: 'Aug',
        8: 'Sep',
        9: 'Oct',
        10: 'Nov',
        11: 'Dec',
      };
      const date = new Date(dateString);
      const dayOfWeek = daysOfWeek[date.getDay()];
      const month = months[date.getMonth()];
      const day = dateSuffixes[date.getDate()] === undefined
        ? `${date.getDate()}th`
        : `${date.getDate()}${dateSuffixes[date.getDate()]}`;
      const year = date.getFullYear();
      const hours = date.getHours() % 12 === 0 ? 12 : date.getHours() % 12;
      const mins = date.getMinutes().toString().length < 2
        ? `0${date.getMinutes().toString()}`
        : date.getMinutes().toString();
      const amPm = date.getHours() >= 12 ? 'PM' : 'AM';
      return `${dayOfWeek} ${month} ${day}, ${year} @ ${hours}:${mins}${amPm}`;
    },
  });
});
