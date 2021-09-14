import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ContentArea from './ContentArea';
import TopBarAndLeftMenu from './TopBarAndLeftMenu';
import { LogStreamProvider } from '../../context/LogStreamContext';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useGlobalConfig } from '../../context/GlobalConfigContext';

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

const DefaultTemplate:React.FC = () => {
  const classes = useStyles();
  const { globalConfig } = useGlobalConfig();

  const theme = React.useMemo(
    () =>
    createTheme({
      palette: {
        type: globalConfig.darkmode,
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
            <ContentArea/>
          </LogStreamProvider>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default DefaultTemplate;
