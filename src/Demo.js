import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import Button from '@material-ui/core/Button';
import Modal from 'react-responsive-modal';

const rows = [
    {
        id: 1,
        industryId: 1,
        indexRelatedOnly: false,
        indexMainOnly: false,
        fireNotification: false,
        appVersion: 'APP_V.1.0.4',
        appPlatform: 0,
        userId: 2087,
        tenantId: 1,
        tenantLocationId: 21,
        cardInfo: 'LEADERBOARD',
        errorMessage: 'Clue/General-Message What Went Wrong',
        errorData: 'Valuable Stack Trace here..',
        createdDate: 1570622614781
    },
    {
        id: 2,
        industryId: 1,
        indexRelatedOnly: false,
        indexMainOnly: false,
        fireNotification: false,
        appVersion: 'APP_V.1.0.4',
        appPlatform: 0,
        userId: 2087,
        tenantId: 1,
        tenantLocationId: 21,
        cardInfo: 'LEADERBOARD',
        errorMessage: 'Clue/General-Message What Went Wrong',
        errorData: 'Valuable Stack Trace here..',
        createdDate: 1570622614781
    }
];

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc'
        ? (a, b) => desc(a, b, orderBy)
        : (a, b) => -desc(a, b, orderBy);
}

const headCells = [
    {
        id: 'id',
        numeric: false,
        disablePadding: true,
        label: 'ID'
    },
    {
        id: 'industryId',
        numeric: true,
        disablePadding: false,
        label: 'Industry Id'
    },
    {
        id: 'appVersion',
        numeric: true,
        disablePadding: false,
        label: 'App Version'
    },
    {
        id: 'appPlatform',
        numeric: true,
        disablePadding: false,
        label: 'App Platform'
    },
    {
        id: 'userId',
        numeric: true,
        disablePadding: false,
        label: 'User Id'
    },
    {
        id: 'tenantId',
        numeric: true,
        disablePadding: false,
        label: 'Tenant Id'
    },
    {
        id: 'tenantLocationId',
        numeric: true,
        disablePadding: false,
        label: 'Tenant Location Id'
    },
    {
        id: 'cardInfo',
        numeric: true,
        disablePadding: false,
        label: 'Card Info'
    },
    {
        id: 'errorMessage',
        numeric: true,
        disablePadding: false,
        label: 'Error Message'
    },
    {
        id: 'errorData',
        numeric: true,
        disablePadding: false,
        label: 'Error Data'
    },
    {
        id: 'createdDate',
        numeric: true,
        disablePadding: false,
        label: 'Created Date'
    }
];

function EnhancedTableHead(props) {
    const {
        classes,
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort
    } = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={
                            numSelected > 0 && numSelected < rowCount
                        }
                        checked={numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all desserts' }}
                    />
                </TableCell>
                {headCells.map(headCell => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={order}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc'
                                        ? 'sorted descending'
                                        : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
};

const useToolbarStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1)
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                  color: theme.palette.secondary.main,
                  backgroundColor: lighten(theme.palette.secondary.light, 0.85)
              }
            : {
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.secondary.dark
              },
    spacer: {
        flex: '1 1 100%'
    },
    actions: {
        color: theme.palette.text.secondary
    },
    title: {
        flex: '0 0 auto'
    }
}));

const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const { numSelected } = props;
    const [selectedStartDate, setSelectedStartDate] = React.useState(
        new Date(Date.now() - 864e5)
    );
    const [selectedEndDate, setSelectedEndDate] = React.useState(new Date());

    const handleStartDateChange = date => {
        setSelectedStartDate(date);
    };

    const handleEndDateChange = date => {
        setSelectedEndDate(date);
    };

    const sliceData = () => {
      console.log("SLICE HAS BEEN CALLED");
      console.log(numSelected)
  
    };
    const [open, setModelSTATE] = useState(false);

    function onCloseModal() {
      setModelSTATE(true)
    };
  
    function onCloseModal() {
      setModelSTATE(false)
    };
  
  
    const handleClickForModal = (event, rowData) => {
      setModelSTATE(true);
      console.log(rowData);
      rowDataForModal = {
        id: rowData.id,
        industryId: rowData.industryId,
        errorMessage: rowData.errorMessage,
        errorData: rowData.errorData,
        cardInfo: rowData.cardInfo
      };
  
    };
  
  
    var rowDataForModal = {
      id: 2,
      industryId: 1,
      errorMessage: 'Clue/General-Message What Went Wrong',
      errorData: 'Valuable Stack Trace here..',
      cardInfo: 'LEADERBOARD'
    };
    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0
            })}
        >
            <div className={classes.title}>
                {numSelected > 0 ? (
                    <Typography color="inherit" variant="subtitle1">
                        {numSelected} selected
                    </Typography>
                ) : (
                    <Typography variant="h6" id="tableTitle">
                        Error Response
                    </Typography>
                )}
            </div>
            <div className={classes.spacer} />
            <div className={classes.actions}>
                {numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton aria-label="delete">
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container spacing={1}>
                            <Grid item xs={4}>
                                <KeyboardDatePicker
                                    disableToolbar
                                    variant="inline"
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    id="date-picker-inline"
                                    label="Start Date"
                                    value={selectedStartDate}
                                    onChange={handleStartDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date'
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <KeyboardDatePicker
                                    disableToolbar
                                    variant="inline"
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    id="date-picker-inline"
                                    label="End Date"
                                    value={selectedEndDate}
                                    onChange={handleEndDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date'
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4} container alignItems="center">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                >
                                    Search
                                </Button>
                            </Grid>
                        </Grid>
                    </MuiPickersUtilsProvider>
                )}
            </div>
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
};

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3)
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2)
    },
    table: {
        minWidth: 750
    },
    tableWrapper: {
        overflowX: 'auto'
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1
    }
}));

export default function EnhancedTable() {
    function myfunction() {
        const options = {
            method: 'GET',
            headers: {
                Authorization: 'bearer 18c00b5d-914e-4e0f-8f6c-daf0c9c6fdb2',
                'Content-Type': 'application/json',
                industryId: 1
            },
            url:
                'https://qa-app.fpg-ingauge.com/pulse/api/error-log/secure?startDateTime=0&endDateTime=9999999999999'
        };
        axios(options)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }
    useEffect(() => {
        myfunction();
    }, []);
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [open, setModelSTATE] = useState(false);

    function onCloseModal() {
      setModelSTATE(true)
    };
  
    function onCloseModal() {
      setModelSTATE(false)
    };
  
  
    const handleClickForModal = (event, rowData) => {
      setModelSTATE(true);
      console.log(rowData);
      rowDataForModal = {
        id: rowData.id,
        industryId: rowData.industryId,
        errorMessage: rowData.errorMessage,
        errorData: rowData.errorData,
        cardInfo: rowData.cardInfo
      };
  
    };
  
  
    var rowDataForModal = {
      id: 2,
      industryId: 1,
      errorMessage: 'Clue/General-Message What Went Wrong',
      errorData: 'Valuable Stack Trace here..',
      cardInfo: 'LEADERBOARD'
    };
    const handleRequestSort = (event, property) => {
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const handleSelectAllClick = event => {
        if (event.target.checked) {
            const newSelecteds = rows.map(n => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const isSelected = name => selected.indexOf(name) !== -1;

    const emptyRows =
        rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
            <EnhancedTableToolbar numSelected={selected.length} sliceIds={selected} />                <div className={classes.tableWrapper}>
                    <Table
                        stickyHeader
                        className={classes.table}
                        aria-labelledby="tableTitle"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {stableSort(rows, getSorting(order, orderBy))
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.id}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                        <Checkbox
                          onClick={event =>
                            handleClick(event, row.id)
                          }
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.id}
                      </TableCell>
                      <TableCell
                        onClick={event =>
                          handleClickForModal(event, row)
                        }
                        align="right">
                        {row.industryId}
                      </TableCell>
                      <TableCell
                        onClick={event =>
                          handleClickForModal(event, row)
                        }
                        align="right">
                        {row.appVersion}
                      </TableCell>
                      <TableCell
                        onClick={event =>
                          handleClickForModal(event, row)
                        }
                        align="right">
                        {row.appPlatform}
                      </TableCell>
                      <TableCell
                        onClick={event =>
                          handleClickForModal(event, row)
                        }
                        align="right">
                        {row.userId}
                      </TableCell>
                      <TableCell
                        onClick={event =>
                          handleClickForModal(event, row)
                        }
                        align="right">
                        {row.tenantId}
                      </TableCell>
                      <TableCell
                        onClick={event =>
                          handleClickForModal(event, row)
                        }
                        align="right">
                        {row.tenantLocationId}
                      </TableCell>
                      <TableCell
                        onClick={event =>
                          handleClickForModal(event, row)
                        }
                        align="right">
                        {row.cardInfo}
                      </TableCell>
                      <TableCell
                        onClick={event =>
                          handleClickForModal(event, row)
                        }
                        align="right">
                        {row.errorMessage}
                      </TableCell>
                      <TableCell
                        onClick={event =>
                          handleClickForModal(event, row)
                        }
                        align="right">
                        {row.errorData}
                      </TableCell>
                      <TableCell
                        onClick={event =>
                          handleClickForModal(event, row)
                        }
                        align="right">
                        {row.createdDate}
                      </TableCell>

                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                  
<Modal open={open} center
        onClose={onCloseModal}
      >
        <h2>ID : {rowDataForModal.id}</h2>
        <h2>Industry Id : {rowDataForModal.industryId}</h2>
        <h2>Card Info : {rowDataForModal.cardInfo}</h2>
        <h2>Error MEssage : {rowDataForModal.errorMessage}</h2>
        <h2>Error Data : {rowDataForModal.errorData}</h2>
      </Modal>
                </div>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'previous page'
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'next page'
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
}
