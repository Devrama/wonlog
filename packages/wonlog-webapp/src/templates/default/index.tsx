import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ContentArea from './ContentArea';
import LeftMenuAndTopAppBar from 'src/components/layout/default/LeftMenuAndTopAppBar';
import { LogStreamProvider } from '../../context/LogStreamContext';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { GlobalConfigProvider } from '../../context/GlobalConfigContext';
import { useDarkmode } from '../../context/DarkmodeContext';

interface WonlogTheme {
  palette: {
    default: DarkModeColor
    critical: DarkModeColor
    debug: DarkModeColor
    trace: DarkModeColor
  },
}

declare module '@material-ui/core/styles/createTheme' {
  export interface ThemeOptions {
    wonlog: WonlogTheme
  }
  export interface Theme {
    wonlog: WonlogTheme
  }
}

interface DarkModeColor {
  dark: string
  light: string
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
}));

interface DefaultTemplateProps {
  contentComponent: React.FC
}

const DefaultTemplate:React.FC<DefaultTemplateProps> = ({ contentComponent }) => {
  const classes = useStyles();
  const { darkmode } = useDarkmode();

  const theme = useMemo(
    () =>
    createTheme({
      palette: {
        type: darkmode,
      },
      wonlog: {
        palette: {
          default: {
            dark: '#3a3a3a',
            light: '#cecece',
          },
          critical: {
            dark: '#c00000',
            light: '#c00000',
          },
          debug: {
            dark: '#5b9bd5',
            light: '#9cd0ff',
          },
          trace: {
            dark: '#ddebf7',
            light: '#ddebf7',
          },
        },
      },
    }),
    [darkmode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={classes.root}>
        <GlobalConfigProvider>
          <LeftMenuAndTopAppBar />
          <div className={classes.content}>
            <div className={classes.toolbar} />
              <LogStreamProvider>
                <ContentArea contentComponent={contentComponent}/>
              </LogStreamProvider>
          </div>
        </GlobalConfigProvider>
      </div>
    </ThemeProvider>
  );
};

export default DefaultTemplate;
