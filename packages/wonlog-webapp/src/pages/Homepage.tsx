import React, { ReactElement, useContext, useState } from 'react';
import clsx from 'clsx';
import ReactJson from 'react-json-view';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import Drawer from '@material-ui/core/Drawer';
import { AutoSizer, Column, Table, TableCellRenderer, TableHeaderProps, RowMouseEventHandlerParams, ScrollEventData } from 'react-virtualized';
import { LogStreamContext, LogData } from '../context/LogStreamContext';
import { GlobalConfigSetDarkmodePayload } from '../context/GlobalConfigContext';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

interface ColumnData {
  dataKey: string;
  label: string;
  numeric?: boolean;
  width: number;
}

interface Row {
  index: number;
}

interface VirtualizedTableProps  {
  columns: ColumnData[];
  headerHeight?: number;
  onRowClick: (params:RowMouseEventHandlerParams) => void;
  onScroll: (params:ScrollEventData) => void;
  rowCount: number;
  rowGetter: (row: Row) => LogData;
  rowHeight?: number;
}

const useStyles = makeStyles((theme) => ({
  detailDrawer: {
    inset: 'unset !important',
    '& .MuiDrawer-paper': {
      width: 'calc(100% - 500px)',
    },
  },
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    whiteSpace: 'nowrap',
    fontSize: '0.8rem',
  },
  tableRow: {
    cursor: 'pointer',
  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: theme.palette.type === GlobalConfigSetDarkmodePayload.LIGHT ? theme.palette.grey[200] : theme.palette.grey[900],
    },
  },
  tableCellHeader: {
    flex: 1,
    position: 'relative',
    padding: '0 10px',
    textTransform: 'uppercase',
    fontWeight: theme.typography.fontWeightBold,
    backgroundColor: '#2f2f2f',
    color: theme.palette.getContrastText('#2f2f2f'),
  },
  tableCell: {
    flex: 1,
    position: 'relative',
    padding: '0 10px',
    fontWeight: theme.typography.fontWeightLight,
    '&::after': {
      bottom: 0,
      color: theme.palette.divider,
      content: '"|"',
      height: 18,
      right: 0,
      margin: 'auto',
      position: 'absolute',
      top: 0,
    },
  },
  noClick: {
    cursor: 'initial',
  },
  flexGrow: {
    flexGrow: 1,
  },
  levelDefault: {
    color: theme.palette.getContrastText(theme.wonlog.palette.default[theme.palette.type]),
    backgroundColor: theme.wonlog.palette.default[theme.palette.type],
  },
  levelCritical: {
    color: theme.palette.getContrastText(theme.wonlog.palette.critical[theme.palette.type]),
    backgroundColor: theme.wonlog.palette.critical[theme.palette.type],
  },
  levelError: {
    color: theme.palette.getContrastText(theme.palette.error[theme.palette.type]),
    backgroundColor: theme.palette.error[theme.palette.type],
  },
  levelWarn: {
    color: theme.palette.getContrastText(theme.palette.warning[theme.palette.type]),
    backgroundColor: theme.palette.warning[theme.palette.type],
  },
  levelInfo: {
    color: theme.palette.getContrastText(theme.palette.info[theme.palette.type]),
    backgroundColor: theme.palette.info[theme.palette.type],
  },
  levelDebug: {
    color: theme.palette.getContrastText(theme.wonlog.palette.debug[theme.palette.type]),
    backgroundColor: theme.wonlog.palette.debug[theme.palette.type],
  },
  levelTrace: {
    color: theme.palette.getContrastText(theme.wonlog.palette.trace[theme.palette.type]),
    backgroundColor: theme.wonlog.palette.trace[theme.palette.type],
  },
}));

const VirtualizedTable:React.FC<VirtualizedTableProps> = ({
  columns,
  rowHeight = 28,
  headerHeight = 38,
  onRowClick,
  onScroll,
  ...tableProps
}) => {
  const classes = useStyles();

  const getRowClassName = ({ index }: Row): string => {
    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    });
  };

  const cellRenderer: TableCellRenderer = ({ rowData, cellData, columnIndex }) => {
    const isFirstColmun = columnIndex === 0;
    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
          [classes.levelDefault]: isFirstColmun && !rowData.level,
          [classes.levelCritical]: isFirstColmun && (rowData.level == 'critical' || rowData.level == 'fatal'),
          [classes.levelError]: isFirstColmun && rowData.level == 'error',
          [classes.levelWarn]: isFirstColmun && (rowData.level == 'warn' || rowData.level == 'warning'),
          [classes.levelInfo]: isFirstColmun && rowData.level == 'info',
          [classes.levelDebug]: isFirstColmun && rowData.level == 'debug',
          [classes.levelTrace]: isFirstColmun && rowData.level == 'trace',
        })}
        variant="body"
        style={{ height: rowHeight }}
        align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
      >
        {cellData}
      </TableCell>
    );
  };

  const headerRenderer = ({ label, columnIndex }: TableHeaderProps & { columnIndex: number }): ReactElement => {
    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCellHeader, classes.flexContainer, classes.noClick)}
        variant="head"
        style={{ height: headerHeight }}
        align={columns[columnIndex].numeric || false ? 'right' : 'left'}
      >
        <span>{label}</span>
      </TableCell>
    );
  };

  return (
    <AutoSizer>
      {({ height, width }): ReactElement => (
        <Table
          height={height}
          width={width}
          rowHeight={Number(rowHeight)}
          gridStyle={{
            direction: 'inherit',
          }}
          headerHeight={Number(headerHeight)}
          {...tableProps}
          rowClassName={getRowClassName}
          onRowClick={onRowClick}
          onScroll={onScroll}
          scrollToAlignment="start"
        >
          {columns.map(({ dataKey, ...other }, index) => {
            return (
              <Column
                key={dataKey}
                headerRenderer={(headerProps): ReactElement =>
                  headerRenderer({
                    ...headerProps,
                    columnIndex: index,
                  })
                }
                className={classes.flexContainer}
                cellRenderer={cellRenderer}
                dataKey={dataKey}
                {...other}
              />
            );
          })}
        </Table>
      )}
    </AutoSizer>
  );
};

let oldLogsOnScreen: LogData[] = [];

export default function Homepage(): ReactElement {
  const classes = useStyles();
  const { logs } = useContext(LogStreamContext);
  const [isScrollOnTop, setIsScrollOnTop] = useState(true);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentDetailLog, setCurrentDetailLog] = useState<LogData>();

  if(!isScrollOnTop && oldLogsOnScreen.length === 0) {
    oldLogsOnScreen = [...logs];
  } else if(isScrollOnTop && oldLogsOnScreen.length > 0) {
    oldLogsOnScreen = [];
  }

  return (
    <Paper style={{ height: '100%', width: '100%' }}>
      <VirtualizedTable
        rowCount={oldLogsOnScreen.length > 0 ? oldLogsOnScreen.length : logs.length}
        rowGetter={({ index }): LogData => oldLogsOnScreen.length > 0 ? oldLogsOnScreen[index] : logs[index]}
        onRowClick={({ rowData }): void => {
          setIsDetailOpen(true);
          setCurrentDetailLog(rowData);
        }}
        onScroll={({ scrollTop }): void => {
          if(scrollTop === 0) {
            setIsScrollOnTop(true);
          } else {
            setIsScrollOnTop(false);
          }
        }}
        columns={[
          {
            width: 150,
            label: 'DateTime',
            dataKey: '_datetime',
          },
          {
            width: 400,
            label: 'Message',
            dataKey: 'message',
            numeric: false,
          },
        ]}
      />
			<Drawer
        hideBackdrop={true}
        anchor="right"
				open={isDetailOpen}
        className={classes.detailDrawer}
			>
        <div style={{display: 'flex'}}>
          <div style={{flexGrow: 1}} />
          <div>
            <IconButton
              aria-label="Close"
              onClick={(): void => {
                setIsDetailOpen(false);
                setCurrentDetailLog(undefined);
              }}
            >
              <CloseIcon />
            </IconButton>
          </div>
        </div>
        <ReactJson
          // eslint-disable-next-line @typescript-eslint/ban-types
          src={currentDetailLog as object}
          name={false}
          theme="monokai"
          displayDataTypes={false}
          displayObjectSize={false}
          enableClipboard={false}
          style={{ flexGrow: 1, padding: 20 }}
          quotesOnKeys={false}
        />
			</Drawer>

    </Paper>
  );
}
