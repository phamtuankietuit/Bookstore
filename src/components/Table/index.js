import { useEffect, useState } from 'react';
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
} from '@fortawesome/free-solid-svg-icons';

import styles from './Table.module.scss';
import { ProductItem } from '~/components/Item';
import { data } from './sample';
import SubHeader from './components/SubHeader';

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

function Table() {
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(data);
            setPending(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }, []);

    const [showHeader, setShowHeader] = useState(true);

    const [selectedRow, setSelectedRow] = useState(0);

    const handleSelectedProducts = ({
        allSelected,
        selectedCount,
        selectedRows,
    }) => {
        selectedCount > 0 ? setShowHeader(true) : setShowHeader(false);
        setSelectedRow(selectedCount);
    };

    return (
        <div className={cx('data-table-container')}>
            <DataTable
                data={rows}
                columns={ProductItem}
                responsive={true}
                compact={true}
                // custom styles
                theme="customTheme"
                customStyles={customStyles}
                highlightOnHover
                pointerOnHover
                // progress
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
                // header
                fixedHeader
                // subHeader
                subHeader={showHeader}
                subHeaderAlign={'left'}
                subHeaderComponent={
                    <SubHeader
                        props={{ count: selectedRow, item_name: 'sản phẩm' }}
                    />
                }
                // sort
                sortIcon={
                    <FontAwesomeIcon
                        className={cx('icon-margin')}
                        icon={faAngleUp}
                    />
                }
                // select
                selectableRows
                selectableRowsVisibleOnly
                selectableRowsHighlight={true}
                selectableRowsComponent={Checkbox}
                selectableRowsComponentProps={selectProps}
                onSelectedRowsChange={handleSelectedProducts}
                // pagination
                pagination
                paginationPerPage={20}
                paginationComponentOptions={{
                    rowsPerPageText: 'Hiển thị: ',
                    rangeSeparatorText: 'trên',
                    noRowsPerPage: false,
                    selectAllRowsItem: false,
                    selectAllRowsItemText: 'Tất cả',
                }}
                paginationRowsPerPageOptions={[20, 50, 100]}
                paginationIconNext={<FontAwesomeIcon icon={faAngleRight} />}
                paginationIconPrevious={<FontAwesomeIcon icon={faAngleLeft} />}
                paginationIconLastPage={
                    <FontAwesomeIcon icon={faAnglesRight} />
                }
                paginationIconFirstPage={
                    <FontAwesomeIcon icon={faAnglesLeft} />
                }
            />
        </div>
    );
}

export default Table;
