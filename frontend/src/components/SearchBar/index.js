import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import classNames from 'classnames/bind';
import styles from './SearchBar.module.scss';

const cx = classNames.bind(styles);

function SearchBar({ placeholder, value, onChange, className, onKeyDown }) {
    const props = {
        onChange,
        onKeyDown,
    };

    const classes = cx('search-bar', {
        [className]: className,
    });

    return (
        <div className={classes}>
            <FontAwesomeIcon
                className={cx('search-bar-icon')}
                icon={faMagnifyingGlass}
            />
            <input
                className={cx('search-bar-input')}
                placeholder={placeholder}
                value={value}
                {...props}
            />
        </div>
    );
}

export default SearchBar;
