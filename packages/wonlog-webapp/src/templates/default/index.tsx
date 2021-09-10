import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ContentArea from './ContentArea';
import TopBarAndLeftMenu from './TopBarAndLeftMenu';
import { LogStreamProvider } from '../../context/LogStreamContext';

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
    // padding: theme.spacing(3),
  },
}));

const DefaultTemplate:React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TopBarAndLeftMenu />
      <div className={classes.content}>
        <div className={classes.toolbar} />
        <LogStreamProvider>
          <ContentArea/>
        </LogStreamProvider>
      </div>
    </div>
  );
};

export default DefaultTemplate;
