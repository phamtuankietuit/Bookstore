import styles from './MultiSelectComp.module.scss';
import classNames from 'classnames/bind';

import { MultiSelect } from 'react-multi-select-component';
import { memo } from 'react';

const cx = classNames.bind(styles);

function MultiSelectComp({
    options,
    selected,
    setSelected,
    hasSelectAll,
    className,
    placeholder,
}) {
    const classes = cx('multi-select-container', {
        [className]: className,
    });

    return (
        <div className={classes}>
            <div className={cx('multi-select-title')}>{placeholder}</div>

            <MultiSelect
                options={options}
                value={selected}
                onChange={setSelected}
                labelledBy="Select"
                hasSelectAll={hasSelectAll}
                overrideStrings={{
                    selectAll: 'Tất cả',
                    search: 'Tìm kiếm...',
                    selectAllFiltered: 'Tất cả (theo tìm kiếm)',
                    noOptions: 'Không có kết quả',
                    selectSomeItems: `Chọn ${
                        placeholder.charAt(0).toLowerCase() +
                        placeholder.slice(1)
                    }`,
                    allItemsAreSelected: 'Tất cả',
                }}
            />
        </div>
    );
}

export default memo(MultiSelectComp);
