import React, { useState, useMemo, ReactElement } from 'react';
import clsx from 'clsx';
import { alpha, makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import InputBase from '@material-ui/core/InputBase';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import SearchIcon from '@material-ui/icons/Search';
import {
  useGlobalConfig,
  GlobalConfigActionType,
  GlobalConfigSetSearchModePayload,
} from 'src/context/GlobalConfigContext';

const useStyles = makeStyles((theme) => ({
  hide: {
    display: 'none',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 1),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchChip: {
    position: 'absolute',
    maxWidth: 190,
    zIndex: 1,
    right: 10,
    bottom: 1,
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 2, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const TopAppBarSearch:React.FC = () => {
  const classes = useStyles();
  const { globalConfig, setGlobalConfig } = useGlobalConfig();

  const [searchInputValue, setSearchInputValue] = useState('');

  const component = useMemo<ReactElement>(
    () => {
      return (
        <>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <Chip
              className={clsx(classes.searchChip, {
                [classes.hide]: !globalConfig.searchKeyword,
              })}
              color="primary"
              label={globalConfig.searchKeyword}
              onDelete={():void => {
                setGlobalConfig({
                  type: GlobalConfigActionType.SET_SEARCH_KEYWORD,
                  payload: '',
                });
              }}
            />
            <InputBase
              value={searchInputValue}
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              onChange={(e): void => {
                setSearchInputValue(e.target.value);
              }}
              onFocus={(e): void => {
                setGlobalConfig({
                  type: GlobalConfigActionType.SET_SEARCH_KEYWORD,
                  payload: '',
                });
                e.target.value='';
              }}
              onKeyDown={(e): void => {
                if(e.key.toLowerCase() === 'enter') {
                  setGlobalConfig({
                    type: GlobalConfigActionType.SET_SEARCH_KEYWORD,
                    payload: e.currentTarget.value,
                  });
                  e.currentTarget.blur();
                  setSearchInputValue('');
                }
              }}
              onBlur={(e): void => {
                setGlobalConfig({
                  type: GlobalConfigActionType.SET_SEARCH_KEYWORD,
                  payload: e.target.value,
                });
                setSearchInputValue('');
              }}
            />
          </div>
          <FormControlLabel
            control={<Switch color="default" checked={globalConfig.searchMode === GlobalConfigSetSearchModePayload.REGEX} onChange={(e): void => {
              setGlobalConfig({
                type: GlobalConfigActionType.SET_SEARCH_MODE,
                payload: e.target.checked ? GlobalConfigSetSearchModePayload.REGEX : GlobalConfigSetSearchModePayload.TEXT,
              });
            }} name="regex" />}
            label="Regex"
          />
        </>
      );
    },
    [classes, globalConfig.searchKeyword, globalConfig.searchMode, searchInputValue]
  );

  return component;
};

export default TopAppBarSearch;
