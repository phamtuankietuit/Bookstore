import { useState } from 'react';
import { format } from 'date-fns';

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { vi } from 'date-fns/locale';
import styles from './DatePicker.module.scss';
import classNames from 'classnames/bind';
import { FaCalendarAlt } from 'react-icons/fa';

const cx = classNames.bind(styles);

function DatePicker() {
    const [show, setShow] = useState(false);

    const [date, setDate] = useState('');

    const [dateString, setDateString] = useState('');

    const handleDateString = (date) => {
        setDate(date);
        setDateString(format(date, 'dd/MM/yyyy'));
        setShow(false);
    };

    return (
        <div className={cx('container')}>
            <div className={cx('date-picker')} onClick={(e) => setShow(!show)}>
                <input type="text" readOnly value={dateString}></input>
                <FaCalendarAlt className={cx('calendar-icon')}></FaCalendarAlt>
            </div>
            {show && (
                <DayPicker
                    locale={vi}
                    mode="single"
                    fromYear={1900}
                    selected={date}
                    onSelect={handleDateString}
                    className={cx('daypicker')}
                    modifiersClassNames={{
                        selected: styles.select,
                    }}
                ></DayPicker>
            )}
        </div>
    );
}

export default DatePicker;
