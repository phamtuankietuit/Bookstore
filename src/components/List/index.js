import classNames from 'classnames/bind';

import styles from './List.module.scss';
import SearchBar from '~/components/SearchBar';

import Table from '~/components/Table';

const cx = classNames.bind(styles);

function List({
    data,
    placeholderSearch,
    search,
    searchVisibility,
    handleSearch,
    pending,
    showSubHeader,
    handleSelectedItems,
    itemComponent,
    filterComponent,
    subHeaderComponent,
}) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('search-filter-container')}>
                    {searchVisibility && (
                        <SearchBar
                            className={cx('search-bar')}
                            placeholder={placeholderSearch}
                            value={search}
                            onChange={(e) => handleSearch(e)}
                        />
                    )}

                    {filterComponent}
                </div>
                <div className={cx('table-container')}>
                    <Table
                        itemComponent={itemComponent}
                        data={data}
                        pending={pending}
                        showSubHeader={showSubHeader}
                        handleSelectedItems={handleSelectedItems}
                        subHeaderComponent={subHeaderComponent}
                    />
                </div>
            </div>
        </div>
    );
}

export default List;
