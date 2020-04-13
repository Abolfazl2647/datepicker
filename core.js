import moment from 'moment-jalaali';
import { 
    getDay, 
    getYear,  
    isToday,
    getMonth,
    subMonths, 
    addMonths,  
    startOfMonth,
    getDaysInMonth } from 'date-fns';

const zeroPad = (value, length) => {
    return `${value}`.padStart(length, '0');
}

const create_days = function (date) {
    let max = getDaysInMonth(date);
    let YEAR =  getYear(date).toString();
    let MONTH = zeroPad(getMonth(date), 2);
    let days = [];
    for ( let i=1 ; i <= max ; i++ ) {
        days.push({
            day: zeroPad(i,2),
            isToday: isToday(new Date(YEAR, MONTH, i)),
            date: YEAR +'/'+ zeroPad(MONTH,2) +'/'+ zeroPad(i,2),
            value: YEAR.toString() + zeroPad(MONTH,2) + zeroPad(i,2),
            dayOfWeek: getDay(new Date(new Date(YEAR, MONTH, i))),
        });
    }
    return days;
}


const TODAY = moment().jYear().toString() + zeroPad(moment().jMonth() + 1,2) + zeroPad(moment().jDate(),2);
const create_days_fa = function (momentDate) {

    let YEAR =  momentDate.jYear();
    let MONTH = momentDate.jMonth() + 1; // jalali count the month from 0 => 11 is esfand
    let max = moment.jDaysInMonth(YEAR, MONTH-1);
    // console.log('max => ', max, 'date -> ', YEAR , MONTH)
    let days = [];
    for ( let i=1 ; i <= max ; i++ ) {
        days.push({
            day: zeroPad(i,2),
            today: ( TODAY === YEAR.toString() + zeroPad(MONTH,2) + zeroPad(i,2)),
            date: YEAR +'/'+ zeroPad(MONTH,2) +'/'+ zeroPad(i,2),
            value: YEAR.toString() + zeroPad(MONTH,2) + zeroPad(i,2),
            dayOfWeek: moment( YEAR +'/'+ MONTH +'/'+ i, 'jYYYY/jM/jD').day(),
        });
    }
    return days;
}

export const create_calendar = function (currentFn) {
    let currentMonth = create_days(startOfMonth(currentFn));
    let prevMonth = create_days(subMonths(currentFn, 1));
    let nextMonth = create_days(addMonths(currentFn, 1));
    let all_en_month = prevMonth.concat(currentMonth.concat(nextMonth));
    // i want to know howmany days will fill between these 42 days
    let beforeMiss_en = (42 - currentMonth.length) - currentMonth[0].dayOfWeek;
    let en_calendar = all_en_month.splice( (prevMonth.length - beforeMiss_en) , 42 );
    return {
        year: getYear(currentFn),
        calendar: en_calendar,
        MONTHS_SHORT:["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        MONTHS:['January','February','March','April','May','June','July','August','September','October','Novemeber','Decemeber'],
        WEEK_DAYS_SHORT:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
        WEEK_DAYS:['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    };
}


export const create_calendar_fa = function (currentFn) {
    
        
    let current_FaMonth = create_days_fa(moment(currentFn).startOf('jMonth'));
    let next_FaMonth = create_days_fa(moment(currentFn).startOf('jMonth').add(1, 'jMonth'));
    let prev_FaMonth = create_days_fa(moment(currentFn).startOf('jMonth').subtract(1, 'jMonth'));
    let all_fa_month = prev_FaMonth.concat(current_FaMonth.concat(next_FaMonth));
    // i want to know howmany days will fill between these 42 days
    
    let missDays = (42 - current_FaMonth.length) - current_FaMonth[0].dayOfWeek;
    let fa_calendar = all_fa_month.splice( (prev_FaMonth.length - missDays) , 42 );
    return {
        year: moment(currentFn).jYear(),
        calendar: fa_calendar,
        WEEK_DAYS_SHORT: ["ش","ی","د","س","چ","پ","ج"],
        WEEK_DAYS: ['شنبه' ,'یکشنبه','دوشنبه','سه شنبه','چهارشنبه','پینج شنبه','جمعه'],
        MONTHS_SHORT: ['فرو','خرد','ارد','تیر','مرد','شهر','مهر','آبان','آذر','دی','بهمن','اسفند'],
        MONTHS: ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند']
    };
}