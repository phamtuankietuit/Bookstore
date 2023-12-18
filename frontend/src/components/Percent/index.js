import classNames from "classnames/bind";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';

import styles from './Percent.module.scss';


const cx = classNames.bind(styles);

function Percent({ percent, up }) {
    return (
        <div className={cx('today-percent', {
            down: !up,
        })}>
            <FontAwesomeIcon
                icon={up ? faCaretUp : faCaretDown}
                className={cx('percent-icon')}
            />
            <div className={cx('percent')}>{percent}<span>%</span></div>
        </div>
    );
}

export default Percent;