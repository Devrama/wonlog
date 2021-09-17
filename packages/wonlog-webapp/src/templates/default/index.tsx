import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ContentArea from './ContentArea';
import TopBarAndLeftMenu from './TopBarAndLeftMenu';
import { LogStreamProvider } from '../../context/LogStreamContext';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useGlobalConfig } from '../../context/GlobalConfigContext';

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
  const { globalConfig } = useGlobalConfig();

  const theme = React.useMemo(
    () =>
    createTheme({
      palette: {
        type: globalConfig.darkmode,
      },
      wonlog: {
        palette: {
          default: {
            dark: '#fff2cc',
            light: '#fff2cc',
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
    [globalConfig.darkmode],
  );


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={classes.root}>
        <TopBarAndLeftMenu />
        <div className={classes.content}>
          <div className={classes.toolbar} />
          <LogStreamProvider>
            <ContentArea contentComponent={contentComponent}/>
          </LogStreamProvider>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default DefaultTemplate;
