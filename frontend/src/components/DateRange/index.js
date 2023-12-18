import { memo, useState } from 'react';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { vi } from 'date-fns/locale';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';

import styles from './DateRange.module.scss';

const cx = classNames.bind(styles);

function DateRange({ className, title, dateString, setDateString, bottom }) {
    const [range, setRange] = useState({});

    const handleDateString = (range) => {
        setRange(range);
        if (range?.from) {
            if (!range.to) {
                setDateString(format(range.from, 'dd/MM/yyyy'));
            } else if (range.to) {
                setDateString(
                    `${format(range.from, 'dd/MM/yyyy')} – ${format(
                        range.to,
                        'dd/MM/yyyy',
                    )}`,
                );
            }
        }
    };

    // Popper visible
    const [visible, setVisible] = useState(false);
    const show = () => setVisible(true);
    const hide = () => setVisible(false);

    const classes = cx('date-range-container', {
        [className]: className,
    });

    return (
        <div className={classes}>
            <div className={cx('title')}>{title}</div>
            <Tippy
                visible={visible}
                interactive={true}
                onClickOutside={hide}
                placement={bottom ? 'bottom' : 'left'}
                render={(attrs) => (
                    <div className={cx('date-picker-wrapper')}>
                        <div
                            className={cx('date-picker')}
                            tabIndex="-1"
                            {...attrs}
                        >
                            <DayPicker
                                locale={vi}
                                mode="range"
                                selected={range}
                                onSelect={handleDateString}
                                captionLayout="dropdown-buttons"
                                fromYear={1800}
                                toDate={new Date()}
                                showOutsideDays
                            />
                        </div>
                    </div>
                )}
            >
                <div
                    className={cx('date-range-content')}
                    onClick={visible ? hide : show}
                >
                    <input
                        className={cx('date-range-input')}
                        readOnly
                        value={dateString}
                    />
                    <FontAwesomeIcon
                        className={cx('date-range-icon')}
                        icon={faCalendarDays}
                    />
                </div>
            </Tippy>
        </div>
    );
}

export default memo(DateRange);
