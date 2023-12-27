import { useState, memo } from 'react';
import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import styles from './Input.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, '');

function Input({
    title,
    error,
    value,
    onChange,
    onChangeMoney,
    money,
    number,
    onChangeNumber,
    required,
    textarea,
    className,
    rows,
    items,
    password,
    ...passProps
}) {
    // PASSWORD
    const [type, setType] = useState(password ? 'password' : 'text');

    const props = {
        ...passProps,
    };

    let Comp = 'input';

    if (textarea) {
        Comp = 'textarea';
        props.rows = rows;
    }

    const classes = cx('wrapper', {
        [className]: className,
    });

    // DROPDOWN
    const [visible, setVisible] = useState(false);
    const show = () => setVisible(true);
    const hide = () => setVisible(false);

    const onClickAction = (item) => {
        onChange(item);
        hide();
    };

    const handleShowPassword = () => {
        if (type === 'text') {
            setType('password');
        } else {
            setType('text');
        }
    }

    return (
        <div className={classes}>
            <Tippy
                visible={visible}
                interactive={true}
                onClickOutside={hide}
                placement="bottom"
                zIndex={1}
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
                                        onClick={() => onClickAction(item)}
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            >
                <div>
                    <div className={cx('title')}>
                        {title}
                        {required && <span className={cx('required')}> *</span>}
                    </div>
                    <div className={cx('input-container')}>
                        <Comp
                            type={type}
                            className={cx({
                                input: true,
                                'error-border': error,
                                'm-h': rows,
                                't-a': money,
                            })}
                            value={value}
                            onChange={(e) => {
                                if (money) {
                                    onChangeMoney(
                                        addCommas(removeNonNumeric(e.target.value)),
                                    );
                                } else if (number) {
                                    onChangeNumber(
                                        removeNonNumeric(e.target.value),
                                    );
                                } else {
                                    onChange(e.target.value);
                                }
                            }}
                            onBlur={() => {
                                if (money && value === '') {
                                    onChangeMoney(0);
                                }
                            }}
                            onFocus={items && (visible ? hide : show)}
                            {...props}
                        />
                        {password &&
                            <FontAwesomeIcon
                                onClick={handleShowPassword}
                                icon={type === 'text' ? faEye : faEyeSlash}
                                className={cx('icon-hide-show')}
                            />
                        }
                    </div>
                    {error && <div className={cx('error')}>{error}</div>}
                </div>
            </Tippy>
        </div>
    );
}

export default memo(Input);
