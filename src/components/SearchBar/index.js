import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import classNames from 'classnames/bind';
import styles from './SearchBar.module.scss';
import { useRef } from 'react';

const cx = classNames.bind(styles);

function SearchBar({ placeholder, setInput }) {

    const searchbarRef = useRef()

    const handleInput = (value) => {
        setInput(value)
    }

    const handleFocus = (e) => {
        searchbarRef.current.style.borderColor = '#3A57E8';
    }



    return (
        <div
            ref={searchbarRef}
            className={cx('search-bar')}
        >
            <FontAwesomeIcon className={cx('search-bar-icon')} icon={faMagnifyingGlass} />
            <input
                className={cx('search-bar-input')}
                placeholder={placeholder}
                onChange={(e) => handleInput(e.target.value)}
            // onFocus={(e) => handleFocus(e)}
            />
        </div>
    );
}

export default SearchBar;
