import { memo } from 'react';
import classNames from 'classnames/bind';
import DataTable, { createTheme } from 'react-data-table-component';
import { Checkbox, CircularProgress, Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAngleLeft,
    faAngleRight,
    faAngleUp,
    faAnglesLeft,
    faAnglesRight,
    faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import styles from './Table.module.scss';

const cx = classNames.bind(styles);

const selectProps = { indeterminate: (isIndeterminate) => isIndeterminate };

createTheme(
    'customTheme',
    {
        text: {
            primary: '#101828',
            secondary: '#101828',
        },
        divider: {
            default: '#EAECF0',
        },
        action: {
            button: '#101828',
            hover: '#101828',
            disabled: 'rgba(0,0,0,.12)',
        },
    },
    'light',
);

const customStyles = {
    headCells: {
        style: {
            paddingLeft: '0px',
            paddingRight: '0px',
        },
    },
    head: {
        style: {
            fontSize: '14px',
        },
    },
    pagination: {
        style: {
            fontSize: '14px',
        },
    },
    rows: {
        style: {},
        highlightOnHoverStyle: {
            backgroundColor: '#EAECF0',
            borderBottomColor: '#EAECF0',
            outline: '1px solid #EAECF0',
        },
    },
    subHeader: {
        style: {
            fontSize: '14px',
            fontWeight: '500',
        },
    },
    table: {
        style: {
            maxHeight: '800px',
            overFlow: 'hidden',
        },
    },
    cells: {
        style: {
            paddingLeft: '0px',
            paddingRight: '0px',
        },
    },
};

function Table({
    pending,
    data,
    showSubHeader,
    handleSelectedItems,
    itemComponent,
    subHeaderComponent,
    onRowClicked,
    selectableRows,
    pagination,
    clearSelectedRows,
}) {
    return (
        <div className={cx('data-table-container')}>
            <DataTable
                data={data}
                columns={itemComponent}
                responsive={true}
                compact={true}
                // CUSTOM STYLES
                theme="customTheme"
                customStyles={customStyles}
                highlightOnHover
                pointerOnHover
                // PROGRESS
                progressPending={pending}
                progressComponent={
                    <Box
                        sx={{
                            display: 'flex',
                            marginTop: '50px',
                            marginBottom: '50px',
                        }}
                    >
                        <CircularProgress color="primary" />
                    </Box>
                }
                // HEADER
                fixedHeader
                // SUBHEADER
                subHeader={showSubHeader}
                subHeaderAlign={'left'}
                subHeaderComponent={subHeaderComponent}
                // ONCLICK ROW
                onRowClicked={onRowClicked}
                // SORT
                sortIcon={
                    <FontAwesomeIcon
                        className={cx('icon-margin')}
                        icon={faAngleUp}
                    />
                }
                // SELECT
                clearSelectedRows={clearSelectedRows}
                selectableRows={selectableRows}
                selectableRowsVisibleOnly
                selectableRowsHighlight={true}
                selectableRowsComponent={Checkbox}
                selectableRowsComponentProps={selectProps}
                onSelectedRowsChange={handleSelectedItems}
                // PAGINATION
                pagination={pagination}
                paginationPerPage={20}
                paginationComponentOptions={{
                    rowsPerPageText: 'Hiển thị: ',
                    rangeSeparatorText: 'trên',
                    noRowsPerPage: false,
                    selectAllRowsItem: false,
                    selectAllRowsItemText: 'Tất cả',
                }}
                paginationRowsPerPageOptions={[12, 24, 48]}
                paginationIconNext={<FontAwesomeIcon icon={faAngleRight} />}
                paginationIconPrevious={<FontAwesomeIcon icon={faAngleLeft} />}
                paginationIconLastPage={
                    <FontAwesomeIcon icon={faAnglesRight} />
                }
                paginationIconFirstPage={
                    <FontAwesomeIcon icon={faAnglesLeft} />
                }
                noDataComponent={
                    <div className={cx('no-data-comp')}>
                        <FontAwesomeIcon
                            className={cx('no-data-icon')}
                            icon={faMagnifyingGlass}
                        />
                        <div className={cx('no-data-title')}>
                            Không có dữ liệu
                        </div>
                    </div>
                }
            />
        </div>
    );
}

export default memo(Table);
