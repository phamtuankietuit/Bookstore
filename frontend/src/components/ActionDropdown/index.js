import { useState } from 'react';
import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import styles from './ActionDropdown.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function ActionDropdown({ items, onClickAction }) {
    // Popper visible
    const [visible, setVisible] = useState(false);
    const show = () => setVisible(true);
    const hide = () => setVisible(false);

    return (
        <div className={cx('wrapper')}>
            <Tippy
                visible={visible}
                interactive={true}
                onClickOutside={hide}
                placement="bottom"
                zIndex={2}
                render={(attrs) => (
                    <div
                        className={cx('item-wrapper')}
                        tabIndex="-1"
                        {...attrs}
                    >
                        <div className={cx('popper')}>
                            <ul className={cx('list-item')}>
                                {items?.map((item, index) => (
                                    <li
                                        key={index}
                                        className={cx('item')}
                                        onClick={() => onClickAction(index)}
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            >
                <div
                    className={cx('dropdown-wrapper')}
                    onClick={visible ? hide : show}
                >
                    <div
                        className={cx({
                            container: true,
                            'container-active': visible,
                        })}
                    >
                        <div className={cx('title')}>Chọn thao tác</div>
                        <FontAwesomeIcon
                            className={cx({
                                icon: !visible,
                                'icon-active': visible,
                            })}
                            icon={faCaretUp}
                        />
                    </div>
                </div>
            </Tippy>
        </div>
    );
}

export default ActionDropdown;
