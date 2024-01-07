import { memo } from 'react';
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
    onRowClicked,
    pending,
    showSubHeader,
    handleSelectedItems,
    itemComponent,
    filterComponent,
    subHeaderComponent,
    selectableRows,
    pagination,
    clearSelectedRows,
    // PAGINATION REMOTE
    totalRows,
    handlePerRowsChange,
    handlePageChange,
    // SORT REMOTE
    handleSort,
    // 
    selectableRowDisabled,
    handleKeyDown,
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
                            onKeyDown={(e) => handleKeyDown(e)}
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
                        onRowClicked={onRowClicked}
                        selectableRows={selectableRows}
                        pagination={pagination}
                        clearSelectedRows={clearSelectedRows}
                        // PAGINATION REMOTE 
                        totalRows={totalRows}
                        handlePerRowsChange={handlePerRowsChange}
                        handlePageChange={handlePageChange}
                        // SORT REMOTE 
                        handleSort={handleSort}
                        // 
                        selectableRowDisabled={selectableRowDisabled}
                    />
                </div>
            </div>
        </div>
    );
}

export default memo(List);
